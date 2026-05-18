import os
import shutil
import subprocess
import time
import urllib.request
from pathlib import Path

from selenium import webdriver
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


RAIZ = Path(__file__).resolve().parents[1]
PUERTO = 3301
BASE_URL = f"http://127.0.0.1:{PUERTO}"
CARPETA_EVIDENCIAS = RAIZ / "documentos" / "evidencias"
CARPETA_FRAMES = CARPETA_EVIDENCIAS / "frames_video"
SALIDA_VIDEO = CARPETA_EVIDENCIAS / "video-demo-selenium.mp4"


def esperar_servidor():
    for _ in range(40):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/api", timeout=1) as respuesta:
                if respuesta.status == 200:
                    return
        except Exception:
            time.sleep(0.25)

    raise RuntimeError("El servidor no respondio a tiempo")


def iniciar_chrome():
    opciones = ChromeOptions()
    opciones.add_argument("--headless=new")
    opciones.add_argument("--no-sandbox")
    opciones.add_argument("--disable-dev-shm-usage")
    opciones.add_argument("--window-size=1440,900")
    return webdriver.Chrome(options=opciones)


def escribir(wait, selector, texto):
    campo = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(texto)


def establecer_valor(driver, wait, selector, valor):
    elemento = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
    driver.execute_script(
        """
        const elemento = arguments[0];
        elemento.value = arguments[1];
        elemento.dispatchEvent(new Event('input', { bubbles: true }));
        elemento.dispatchEvent(new Event('change', { bubbles: true }));
        """,
        elemento,
        valor
    )


def capturar(driver, numero, nombre, repeticiones=3):
    destino = CARPETA_FRAMES / f"frame_{numero:03d}_{nombre}.png"
    driver.save_screenshot(str(destino))

    for indice in range(repeticiones - 1):
        copia = CARPETA_FRAMES / f"frame_{numero:03d}_{nombre}_{indice + 1}.png"
        shutil.copyfile(destino, copia)


def generar_video():
    CARPETA_EVIDENCIAS.mkdir(parents=True, exist_ok=True)

    if CARPETA_FRAMES.exists():
        shutil.rmtree(CARPETA_FRAMES)

    CARPETA_FRAMES.mkdir(parents=True)

    servidor = subprocess.Popen(
        ["node", "servidor.js"],
        cwd=RAIZ,
        env={
            **os.environ,
            "PORT": str(PUERTO),
            "USAR_PG_MEM": "1",
            "PGDATABASE": "reservas academicas video"
        },
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    driver = None

    try:
        esperar_servidor()
        driver = iniciar_chrome()
        wait = WebDriverWait(driver, 10)

        driver.get(f"{BASE_URL}/")
        time.sleep(0.2)
        capturar(driver, 1, "login")

        escribir(wait, "#contactoInstitucional", "coordinacion@universidad.edu")
        escribir(wait, "#codigoSeguro", "clave123")
        capturar(driver, 2, "login_credenciales")
        driver.find_element(By.CSS_SELECTOR, "#formularioLogin button[type='submit']").click()
        wait.until(EC.url_contains("/dashboard.html"))
        wait.until(EC.text_to_be_present_in_element((By.ID, "conteoEspacios"), "3"))
        capturar(driver, 3, "dashboard")

        driver.find_element(By.LINK_TEXT, "Nueva reserva").click()
        wait.until(EC.url_contains("/reserva.html"))
        selector = wait.until(EC.presence_of_element_located((By.ID, "espacioId")))
        Select(selector).select_by_visible_text("Auditorio Central")
        establecer_valor(driver, wait, "#fechaReserva", "2026-04-18")
        establecer_valor(driver, wait, "#horaInicioReserva", "13:00")
        establecer_valor(driver, wait, "#horaFinReserva", "15:00")
        escribir(wait, "#motivoReserva", "Presentacion de proyecto academico")
        wait.until(EC.text_to_be_present_in_element((By.ID, "estadoEspacio"), "Libre"))
        capturar(driver, 4, "formulario_reserva")

        driver.find_element(By.CSS_SELECTOR, "#formularioReserva button[type='submit']").click()
        wait.until(EC.text_to_be_present_in_element((By.ID, "mensajeReserva"), "Reserva creada correctamente"))
        capturar(driver, 5, "reserva_creada", repeticiones=4)

        driver.get(f"{BASE_URL}/dashboard.html")
        wait.until(EC.text_to_be_present_in_element((By.ID, "conteoReservas"), "1"))
        capturar(driver, 6, "dashboard_final", repeticiones=4)

        comando = [
            "ffmpeg",
            "-y",
            "-framerate",
            "1",
            "-pattern_type",
            "glob",
            "-i",
            str(CARPETA_FRAMES / "*.png"),
            "-vf",
            "scale=1280:-2,format=yuv420p",
            str(SALIDA_VIDEO)
        ]
        subprocess.run(comando, check=True, cwd=RAIZ)
        print(f"Video generado en {SALIDA_VIDEO}")
    finally:
        if driver:
            driver.quit()

        servidor.terminate()
        try:
            servidor.wait(timeout=5)
        except subprocess.TimeoutExpired:
            servidor.kill()


if __name__ == "__main__":
    generar_video()

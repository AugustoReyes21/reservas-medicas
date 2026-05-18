import os
import subprocess
import time
import unittest
import urllib.request
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver import ChromeOptions, FirefoxOptions, SafariOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


RAIZ = Path(__file__).resolve().parents[1]
PUERTO = int(os.environ.get("SELENIUM_PORT", "3201"))
BASE_URL = f"http://127.0.0.1:{PUERTO}"


def esperar_servidor():
    for _ in range(40):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/api", timeout=1) as respuesta:
                if respuesta.status == 200:
                    return
        except Exception:
            time.sleep(0.25)

    raise RuntimeError("El servidor no respondio a tiempo")


def iniciar_navegador():
    navegador = os.environ.get("SELENIUM_BROWSER", "chrome").lower()

    if navegador == "firefox":
        opciones = FirefoxOptions()
        opciones.add_argument("-headless")
        return webdriver.Firefox(options=opciones)

    if navegador == "safari":
        return webdriver.Safari(options=SafariOptions())

    opciones = ChromeOptions()
    opciones.add_argument("--headless=new")
    opciones.add_argument("--no-sandbox")
    opciones.add_argument("--disable-dev-shm-usage")
    opciones.add_argument("--window-size=1440,1000")
    return webdriver.Chrome(options=opciones)


class PruebasSeleniumReservas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        entorno = {
            **os.environ,
            "PORT": str(PUERTO),
            "USAR_PG_MEM": "1",
            "PGDATABASE": "reservas academicas selenium"
        }

        cls.servidor = subprocess.Popen(
            ["node", "servidor.js"],
            cwd=RAIZ,
            env=entorno,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        esperar_servidor()
        cls.driver = iniciar_navegador()
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        if getattr(cls, "driver", None):
            cls.driver.quit()

        if getattr(cls, "servidor", None):
            cls.servidor.terminate()
            try:
                cls.servidor.wait(timeout=5)
            except subprocess.TimeoutExpired:
                cls.servidor.kill()

    def setUp(self):
        self.driver.get(f"{BASE_URL}/")
        self.driver.execute_script("localStorage.clear()")
        time.sleep(0.15)

    def escribir(self, selector, texto):
        campo = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
        campo.clear()
        campo.send_keys(texto)
        return campo

    def establecer_valor(self, selector, valor):
        elemento = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        self.driver.execute_script(
            """
            const elemento = arguments[0];
            elemento.value = arguments[1];
            elemento.dispatchEvent(new Event('input', { bubbles: true }));
            elemento.dispatchEvent(new Event('change', { bubbles: true }));
            """,
            elemento,
            valor
        )
        return elemento

    def iniciar_sesion(self):
        self.driver.get(f"{BASE_URL}/")
        time.sleep(0.15)
        self.escribir("#contactoInstitucional", "coordinacion@universidad.edu")
        self.escribir("#codigoSeguro", "clave123")
        self.driver.find_element(By.CSS_SELECTOR, "#formularioLogin button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard.html"))

    def test_01_login_rechaza_credenciales_invalidas_y_permite_acceso_valido(self):
        self.escribir("#contactoInstitucional", "coordinacion@universidad.edu")
        self.escribir("#codigoSeguro", "clave-incorrecta")
        self.driver.find_element(By.CSS_SELECTOR, "#formularioLogin button[type='submit']").click()

        mensaje = self.driver.find_element(By.ID, "mensajeLogin")
        self.wait.until(lambda _driver: "Credenciales incorrectas" in mensaje.text)
        self.assertIn("Credenciales incorrectas", mensaje.text)

        self.escribir("#codigoSeguro", "clave123")
        self.driver.find_element(By.CSS_SELECTOR, "#formularioLogin button[type='submit']").click()

        self.wait.until(EC.url_contains("/dashboard.html"))
        self.assertIn("dashboard.html", self.driver.current_url)
        self.assertIn("Coordinacion Academica", self.driver.page_source)

    def test_02_dashboard_carga_resumen_y_consulta_disponibilidad(self):
        self.iniciar_sesion()

        self.wait.until(EC.text_to_be_present_in_element((By.ID, "conteoEspacios"), "3"))
        self.establecer_valor("#fechaConsulta", "2026-04-18")
        self.establecer_valor("#horaInicioConsulta", "13:00")
        self.establecer_valor("#horaFinConsulta", "15:00")

        estado = self.wait.until(EC.visibility_of_element_located((By.ID, "estadoConsulta")))
        self.wait.until(lambda _driver: "Hay 3 espacios disponibles" in estado.text)
        self.assertEqual("3", self.driver.find_element(By.ID, "conteoDisponibles").text)

    def test_03_reserva_crea_solicitud_y_bloquea_horario_cruzado(self):
        self.iniciar_sesion()
        self.driver.find_element(By.LINK_TEXT, "Nueva reserva").click()
        self.wait.until(EC.url_contains("/reserva.html"))

        selector = self.wait.until(EC.presence_of_element_located((By.ID, "espacioId")))
        Select(selector).select_by_visible_text("Auditorio Central")
        self.establecer_valor("#fechaReserva", "2026-04-18")
        self.establecer_valor("#horaInicioReserva", "13:00")
        self.establecer_valor("#horaFinReserva", "15:00")
        self.escribir("#motivoReserva", "Presentacion de proyecto academico")

        self.wait.until(EC.text_to_be_present_in_element((By.ID, "estadoEspacio"), "Libre"))
        self.driver.find_element(By.CSS_SELECTOR, "#formularioReserva button[type='submit']").click()

        mensaje = self.wait.until(EC.visibility_of_element_located((By.ID, "mensajeReserva")))
        self.wait.until(lambda _driver: "Reserva creada correctamente" in mensaje.text)
        self.assertIn("Auditorio Central", mensaje.text)

        self.escribir("#motivoReserva", "Intento de reserva cruzada")
        self.establecer_valor("#horaInicioReserva", "14:00")
        self.establecer_valor("#horaFinReserva", "16:00")
        self.wait.until(EC.text_to_be_present_in_element((By.ID, "estadoEspacio"), "Ocupado"))
        self.driver.find_element(By.CSS_SELECTOR, "#formularioReserva button[type='submit']").click()

        self.wait.until(lambda _driver: "ya tiene una reserva" in mensaje.text)
        self.assertIn("ya tiene una reserva", mensaje.text)

    def test_04_cierre_de_sesion_protege_modulos_privados(self):
        self.iniciar_sesion()
        self.driver.find_element(By.CSS_SELECTOR, "[data-cerrar-sesion]").click()
        self.wait.until(lambda _driver: self.driver.current_url.rstrip("/").endswith(BASE_URL))

        self.driver.get(f"{BASE_URL}/reserva.html")
        try:
            self.wait.until(EC.url_matches(f"{BASE_URL}/$"))
        except TimeoutException:
            self.fail("La ruta protegida de reserva no redirigio al login")


if __name__ == "__main__":
    unittest.main(verbosity=2)

# Optional browser checks: Python Playwright and Chromium required.
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import threading,functools,csv,io,shutil,tempfile,os
class QuietHandler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(Path(__file__).resolve().parents[1] / 'demo')))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/twijgje.html'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_BIN') or shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1050});page.set_default_timeout(10000)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(url,wait_until='domcontentloaded')
 assert page.locator('#daily-rows tr').count()==4
 # Native blur/change must preserve the next field and keyboard focus.
 meal_input=page.locator('[data-client="D001"][data-field="meal"]')
 meal_input.fill('2');meal_input.press('Tab')
 assert page.locator('[data-client="D001"][data-field="soup"]').evaluate('(el)=>el===document.activeElement')
 def set_value(selector,value):
  page.locator(selector).fill(value);page.locator(selector).dispatch_event('change')
 for field,value in [('meal','2'),('soup','2'),('snack','3'),('extraCents','15.75')]:
  set_value(f'[data-client="D001"][data-field="{field}"]',value)
 page.get_by_role('tab',name='Maandafrekening').click()
 assert page.locator('#print').is_disabled()
 assert page.get_by_text('Vul bij ieder vrij bedrag een omschrijving in voordat je afdrukt.').count()==1
 page.get_by_role('tab',name='Daglijst',exact=True).click()
 set_value('[data-client="D001"][data-field="extraNote"]','Winkeltje en uitstap')
 page.get_by_role('tab',name='Instellingen',exact=True).click()
 page.locator('#rate-soup').fill('1.25');page.locator('#rate-snack').fill('1.50')
 page.get_by_role('button',name='Tarief bewaren').click()
 page.get_by_role('tab',name='Maandafrekening').click()
 assert '€\xa038,75' in page.locator('.invoice-total').inner_text()
 assert page.locator('#print').is_enabled()
 mealrow=page.locator('#invoice tbody tr').filter(has_text='Middagmaal')
 assert mealrow.locator('td').nth(2).inner_text()=='2'
 assert '€\xa08,00'==mealrow.locator('td').nth(4).inner_text()
 assert page.get_by_text('Winkeltje en uitstap',exact=True).count()==1
 page.pdf(path=str(Path(tempfile.gettempdir())/'twijgje-aantallen-concept.pdf'),format='A4',print_background=True)
 page.locator('#mail-name').fill('Bewindvoerder Voorbeeld');page.locator('#mail-email').fill('voorbeeld@example.invalid')
 page.locator('#mail-compose').click()
 assert page.locator('#mail-preview').is_visible()
 assert page.locator('#mail-open').get_attribute('href').startswith('mailto:voorbeeld%40example.invalid?')
 assert '€\xa038,75' in page.locator('#mail-body').input_value()
 page.locator('#recipient').select_option('pvt')
 assert page.locator('#mail-email').input_value()==''
 assert '€\xa016,00' in page.locator('.invoice-total').inner_text()
 page.get_by_role('tab',name='Daglijst',exact=True).click()
 page.locator('#period').select_option('pm')
 assert page.locator('[data-client="D001"][data-field="meal"]').input_value()=='2'
 page.get_by_role('tab',name='Maandafrekening').click();page.locator('#recipient').select_option('D001')
 assert '€\xa038,75' in page.locator('.invoice-total').inner_text()
 assert page.locator('#mail-email').input_value()=='voorbeeld@example.invalid'
 page.reload(wait_until='domcontentloaded')
 assert page.locator('[data-client="D001"][data-field="meal"]').input_value()=='2'
 assert page.locator('[data-client="D001"][data-field="extraNote"]').input_value()=='Winkeltje en uitstap'
 page.get_by_role('tab',name='Overzichten',exact=True).click()
 assert page.locator('#year-stats .stat').nth(0).locator('strong').inner_text()=='3'
 assert page.locator('#year-stats .stat').nth(1).locator('strong').inner_text()=='1'
 assert page.locator('#pvt-rows tr').first.locator('td').nth(1).inner_text()=='1'
 assert page.locator('#pvt-rows tr').first.locator('td').nth(2).inner_text()=='2'
 page.locator('#pvt-month').select_option('07')
 with page.expect_download() as dl:page.locator('#export-pvt').click()
 download=dl.value;download.save_as(str(Path(tempfile.gettempdir())/download.suggested_filename))
 rows=list(csv.reader(io.StringIO(Path(download.path()).read_text(encoding='utf-8-sig')),delimiter=';'))
 assert rows[1][3:8]==['D003','Sam Demo','1','2','1']
 assert rows[2][3:8]==['D004','Robin Fictief','1','1','0,5']
 with page.expect_download() as dl:page.locator('#export-year').click()
 assert dl.value.suggested_filename=='twijgje-jaaroverzicht-2026.csv'
 page.screenshot(path=str(Path(tempfile.gettempdir())/'twijgje-overzichten.png'),full_page=True)
 page.get_by_role('tab',name='Instellingen',exact=True).click()
 form=page.locator('[data-dates="D002"]')
 form.locator('[name="started"]').fill('2025-12-31');form.locator('button').click()
 page.get_by_role('tab',name='Overzichten',exact=True).click()
 assert page.locator('#year-stats .stat').first.locator('strong').inner_text()=='2'
 # Fully on leave removes every type of cost.
 page.get_by_role('tab',name='Daglijst',exact=True).click()
 page.locator('[data-client="D001"][data-field="am"]').select_option('leave')
 page.locator('#period').select_option('pm')
 page.locator('[data-client="D001"][data-field="pm"]').select_option('leave')
 assert page.locator('[data-client="D001"][data-field="meal"]').input_value()=='0'
 assert page.locator('[data-client="D001"][data-field="extraCents"]').input_value()=='0.00'
 assert page.locator('[data-client="D001"][data-field="extraNote"]').input_value()==''
 page.screenshot(path=str(Path(tempfile.gettempdir())/'twijgje-aantallen.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844})
 for tab in ['Daglijst','Maandafrekening','Overzichten','Instellingen']:
  page.get_by_role('tab',name=tab,exact=True).click()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), tab
 assert not errors,errors
 # Open the new version with genuine v1 fixture shape, maintaining existing data.
 old=page.evaluate('''()=>{const d=Twijgje.seed();return {version:1,clients:d.clients.map(({id,name,recipient,plan})=>({id,name,recipient,plan})),rates:d.rates.map(({snack,...r})=>r),records:Object.fromEntries(Object.entries(d.records).map(([date,rs])=>[date,Object.fromEntries(Object.entries(rs).map(([id,r])=>[id,{am:r.am,pm:r.pm,meal:!!r.meal,soup:false,other:false}]))]))}}''')
 page.evaluate('(d)=>localStorage.setItem("twijgje-demo-v1",JSON.stringify(d))',old)
 page.reload(wait_until='domcontentloaded')
 assert page.locator('[data-client="D001"][data-field="meal"]').input_value()=='1'
 page.get_by_role('tab',name='Overzichten',exact=True).click()
 assert '5 cliënt(en)' in page.locator('#year-warning').inner_text()
 assert page.evaluate('localStorage.getItem("twijgje-demo-v1-backup-v1") !== null')
 assert not errors,errors
 print('Browser geslaagd: aantallen en €38,75 concept, omschrijving/tariefblokkades, mailconcept zonder verzending, gescheiden ontvangers, opslag, gedeelde dagkosten, jaar- en PVT-overzicht, CSV-downloads, datumaanpassing, verlof, mobiel, v1-migratie en PDF.')
 b.close()
server.shutdown()

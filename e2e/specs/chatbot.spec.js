// ...existing code...
const fs = require('fs');
const path = require('path');

describe('🤖 Test del Chatbot', () => {
    
    it('Debe abrir la app y ver el chatbot', async () => {
        // Esperar 3 segundos a que cargue
        await driver.pause(3000);
        
        console.log('✅ La app se abrió correctamente');
    });

    it('Debe encontrar el input del chat', async () => {
        // carpetas para artefactos de depuración
        const outDir = path.resolve(__dirname, '../screenshots');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        // varios selectores alternativos (probar varios métodos)
        const selectors = [
            'android=new UiSelector().text("Escribe.....")',
            'android=new UiSelector().textContains("Escribe")',
            '//*[@text="Escribe....."]',
            '//*[contains(@text,"Escribe")]',
            'android=new UiSelector().resourceId("com.anonymous.ucvgreenmobility:id/chat_input")',
            '~chat_input' // accessibility id
        ];

        let chatInput = null;
        for (const sel of selectors) {
            try {
                const el = await driver.$(sel);
                await el.waitForExist({ timeout: 8000 });
                if (await el.isDisplayed()) {
                    chatInput = el;
                    console.log('Selector exitoso:', sel);
                    break;
                }
            } catch (err) {
                // continuar con el siguiente selector
            }
        }

        // si no se encontró, guardar evidencia para depuración
        if (!chatInput) {
            const screenshotPath = path.join(outDir, 'chat_input-failed.png');
            const pageSourcePath = path.join(outDir, 'chat_input-view.xml');

            try {
                await driver.saveScreenshot(screenshotPath);
            } catch (e) {
                console.log('No se pudo guardar screenshot:', e.message);
            }

            try {
                const src = await driver.getPageSource();
                fs.writeFileSync(pageSourcePath, src, 'utf8');
            } catch (e) {
                console.log('No se pudo guardar page source:', e.message);
            }

            console.log('Debug: screenshot y pageSource guardados en', outDir);
        }

        const exists = !!(chatInput && await chatInput.isDisplayed());
        console.log('¿Input visible?', exists);

        expect(exists).toBe(true);
    });
});
// ...existing code...
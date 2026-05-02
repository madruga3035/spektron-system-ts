import { chromium } from 'playwright';

async function capturarProdutoML(url: string) {
    console.time('Tempo de Execução');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Bloqueia imagens para ganhar velocidade
        await page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());

        await page.goto(url, { waitUntil: 'networkidle' });

        // Espera o título principal carregar
        await page.waitForSelector('.ui-pdp-title');

        const produto = await page.evaluate(() => {
            // No ML, o título principal costuma ser um h1 com essa classe
            const nome = document.querySelector('.ui-pdp-title')?.textContent?.trim() || '';
            
            // O preço no ML é dividido em frações e centavos
            const parteInteira = document.querySelector('.andes-money-amount__fraction')?.textContent?.trim() || '0';
            const centavos = document.querySelector('.andes-money-amount__cents')?.textContent?.trim() || '00';
            
            // A imagem principal
            const imgElement = document.querySelector('.ui-pdp-gallery__figure__image') as HTMLImageElement;
            const imagemUrl = imgElement?.src || '';

            return {
                nome,
                precoText: `${parteInteira}.${centavos}`,
                imagemUrl
            };
        });

        // Converte o preço para número
        const precoFinal = parseFloat(produto.precoText.replace('.', '').replace(',', '.'));

        console.log("=== DADOS DO PRODUTO ===");
        console.log(`Nome:  ${produto.nome}`);
        console.log(`Preço: R$ ${precoFinal.toFixed(2)}`);
        console.log(`Link Imagem: ${produto.imagemUrl}`);

    } catch (error) {
        console.error("Erro ao capturar produto:", error);
    } finally {
        await browser.close();
        console.timeEnd('Tempo de Execução');
    }
}

const urlProduto = 'https://www.mercadolivre.com.br/motor-basculante-ppa-bv-levante-legero-14hp-300kg-8s-rapido/up/MLBU3660609649...'; // seu link aqui
capturarProdutoML(urlProduto);
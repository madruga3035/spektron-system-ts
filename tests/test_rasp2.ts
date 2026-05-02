import { chromium } from 'playwright';
import { performance } from 'perf_hooks';

async function capturarDadosComPlaywright(url: string) {
    // 1. Lança o navegador (headless: true para não abrir a janela)
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const t0 = performance.now(); // Início

    try {
        // 2. Vai até a URL e espera carregar
        await page.goto(url, { waitUntil: 'networkidle' });

        // 3. O SEGREDO: Espera o elemento do preço aparecer na tela
        await page.waitForSelector('.product-variation__final-price', { timeout: 10000 });

        // 4. Captura os dados diretamente da página
        const dados = await page.evaluate(() => {
            const nome = document.querySelector('.product-detail-section h4')?.textContent?.trim() || '';
            const precoText = document.querySelector('.product-variation__final-price')?.textContent?.trim() || '';
            const imgElement = document.querySelector('.gallery') as HTMLImageElement;
            const imagemUrl = imgElement?.src || '';

            return { nome, precoText, imagemUrl };
        });

        // 5. Limpeza do preço (igual fizemos antes)
        const precoLimpo = dados.precoText
            .replace('R$', '')
            .replace(/\s/g, '')
            .replace(',', '.');

        const precoFinal = parseFloat(precoLimpo);

        console.log("Dados capturados com sucesso:", {
            ...dados,
            preco: precoFinal
        });
        const t1 = performance.now(); // Fim
        const totalSegundos = ((t1 - t0) / 1000).toFixed(2);
        
        console.log(`A consulta levou ${totalSegundos} segundos para ser concluída.`);

    } catch (error) {
        console.error("Erro na captura:", error);
    } finally {
        await browser.close();
    }
}

capturarDadosComPlaywright('https://minhacooper.com.br/loja/i.norte-bnu/produto/2578352/granola-com-frutas-vermelhas-kg');
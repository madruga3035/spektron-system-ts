import axios from 'axios';
import * as cheerio from 'cheerio';

interface Produto {
    nome: string;
    preco: number;
    imagemUrl: string;
}

async function capturarDadosProduto(url: string): Promise<Produto | null> {
    try {
        const { data } = await axios.get(url, {
            headers: { 
                // User-Agent mais completo para evitar bloqueios e simular navegador real
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'pt-BR,pt;q=0.9'
            }
        });

        const $ = cheerio.load(data);

        // 1. Extração com seletores alternativos
        const nome = $('h1.ui-pdp-title').text().trim();
        
        // No ML, o preço pode estar no meta tag ou em uma tag de script/JSON-LD
        let precoRaw = $('meta[itemprop="price"]').attr('content');
        
        // Fallback: Se o meta não existir, tenta pegar do texto (seletor comum de preço)
        if (!precoRaw) {
            precoRaw = $('.andes-money-amount__fraction').first().text();
        }

        const imagemUrl = $('img.ui-pdp-image').first().attr('src') || '';

        console.log("Dados brutos capturados:", { nome, precoRaw, imagemUrl });

        // 2. Validação antes do processamento (Evita o erro de 'undefined')
        if (!precoRaw) {
            throw new Error("Preço não encontrado na página.");
        }

        // 3. Limpeza inteligente
        // Como o meta content geralmente já vem '64.89', não precisa de replace de vírgula.
        // Mas se vier do fallback (texto), precisamos limpar.
        const precoLimpo = precoRaw
            .replace('R$', '')
            .replace(/\./g, '') // Remove ponto de milhar
            .replace(',', '.')  // Troca vírgula decimal por ponto
            .trim();

        const precoFinal = parseFloat(precoLimpo);

        return {
            nome: nome || "Nome não encontrado",
            preco: precoFinal,
            imagemUrl
        };

    } catch (error: any) {
        console.error("Erro ao capturar dados:", error.message);
        return null;
    }
}

capturarDadosProduto('https://www.mercadolivre.com.br/kit-suporte-fixacao-motor-portao-eletronico-ppa-basculante/up/MLBU1168690737')
    .then(produto => console.log("Resultado Final:", produto));
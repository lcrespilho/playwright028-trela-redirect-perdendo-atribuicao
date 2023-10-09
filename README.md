## O que faz?

Valida se https://www.trela.com.br/ está perdendo atribuição.

## Como?

Simula entradas contendo gclid com diferentes presets de velocidade de internet, validando se o hit de GA4 possui atribuição correta.

## Uso

### Instalação inicial
```bash
git clone git@github.com:lcrespilho/playwright028-trela-redirect-perdendo-atribuicao.git
cd playwright028-trela-redirect-perdendo-atribuicao
npm i
```

Existem 4 presets predefinidos: `lentao`, `lento`, `medio`, `rapido`. Exemplo de execução para o preset `medio`:

```bash
npm run test-preset-medio # test-preset-<TROCAR PELO PRESET DESEJADO>
npm run show-report
```

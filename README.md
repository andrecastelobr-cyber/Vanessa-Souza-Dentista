# Dra. Vanessa Souza · site

Site estático em português, sem dependências de build. Os arquivos prontos para hospedagem ficam em `site/`.

## Abrir localmente

```sh
cd site
python3 -m http.server 4173
```

Abra `http://localhost:4173`. Para visualizar no celular, conecte-o à mesma rede Wi-Fi do computador e abra `http://<IP-do-computador>:4173`. No macOS, veja o IP com `ipconfig getifaddr en0`.

O QR code temporário da prévia fica na raiz do projeto e não faz parte dos arquivos versionados.

## Publicar

Envie o conteúdo de `site/` para a raiz do host estático. Não é necessário instalar Node.js ou Bun nem executar uma etapa de build.

O vídeo original e os arquivos fonte estão em `fonte/`; a página usa os quadros WebP em `site/assets/frames/`. Os canais de contato configurados são WhatsApp e Instagram.

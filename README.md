# ArsSétima

**Ferramenta pessoal para gerenciar e desenvolver o universo de "O Preço do Sétimo Poder"**

Um aplicativo móvel completo em React Native + Expo para organizar personagens, locais, eventos, notas e capítulos do seu universo literário.

## 🎨 Características

- 📖 **Enciclopédia completa**: Personagens, Locais, Facções, Magias, Itens, Criaturas
- ⏰ **Linha do Tempo**: Eventos cronológicos com links para personagens e locais
- ✍️ **Editor de escrita**: Escreva capítulos com contador de palavras
- 📝 **Sistema de notas**: Organize ideias por categoria e prioridade
- 📄 **Exportação em PDF**: Gere PDFs estilizados de qualquer entidade
- 💾 **Backup/Import**: Exporte e importe todos os dados em JSON
- 🌗 **Temas claro/escuro**: Interface adaptável
- 📱 **Offline-first**: Todos os dados salvos localmente com SQLite

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou yarn
- Expo CLI (será instalado automaticamente)
- Expo Go app no seu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

1. **Clone ou navegue até o diretório do projeto**:
   ```bash
   cd ArsSétima
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm start
   ```
   ou
   ```bash
   expo start
   ```

4. **Execute no seu dispositivo**:
   - Abra o app **Expo Go** no seu celular
   - Escaneie o QR code que aparece no terminal ou no navegador
   - Aguarde o app carregar

### Comandos Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm start

# Rodar no Android
npm run android

# Rodar no iOS (requer macOS)
npm run ios

# Rodar no navegador
npm run web

# Formatar código
npm run format

# Lint
npm run lint
```

## 📁 Estrutura do Projeto

```
ArsSétima/
├── App.tsx                 # Componente raiz
├── app.json               # Configuração do Expo
├── package.json           # Dependências
├── tsconfig.json          # Configuração TypeScript
├── assets/                # Imagens e ícones
├── seed/
│   └── seed-data.json    # Dados iniciais de exemplo
└── src/
    ├── components/        # Componentes reutilizáveis
    │   ├── CharacterCard.tsx
    │   ├── TimelineItem.tsx
    │   ├── EntityCard.tsx
    │   ├── Button.tsx
    │   └── EmptyState.tsx
    ├── screens/          # Telas do app
    │   ├── HomeScreen.tsx
    │   ├── CharacterScreen.tsx
    │   ├── TimelineScreen.tsx
    │   ├── NotesScreen.tsx
    │   ├── WritingScreen.tsx
    │   └── SettingsScreen.tsx
    ├── navigation/       # Configuração de navegação
    │   └── index.tsx
    ├── services/         # Lógica de negócio
    │   ├── storageService.ts
    │   └── pdfService.ts
    ├── database/         # Camada de dados (SQLite)
    │   └── migrations.ts
    ├── types/            # Tipos TypeScript
    │   ├── character.ts
    │   ├── location.ts
    │   ├── event.ts
    │   └── ...
    └── utils/            # Utilitários
        ├── theme.ts
        ├── ThemeContext.tsx
        └── helpers.ts
```

## 📦 Gerando APK para Android

### Método 1: Expo Build (Recomendado)

1. **Instale o EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Configure o projeto**:
   ```bash
   eas build:configure
   ```

3. **Gere o APK**:
   ```bash
   eas build --platform android --profile preview
   ```

4. **Baixe o APK**:
   - Aguarde o build finalizar (5-15 minutos)
   - Acesse o link fornecido no terminal
   - Faça download do APK

### Método 2: Build Local

```bash
expo build:android -t apk
```

> **Nota**: Builds locais podem requerer configuração adicional do Android SDK.

## 📚 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **SQLite** - Banco de dados local
- **Expo Print** - Geração de PDFs
- **AsyncStorage** - Configurações
- **React Native Paper** - Componentes UI

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto é de uso pessoal. © 2025

## 🎯 Roadmap Futuro

- [ ] Sincronização em nuvem
- [ ] Colaboração multi-usuário
- [ ] IA para sugestões de plot
- [ ] Gerador de mapas interativos
- [ ] Visualização de relacionamentos em grafo
- [ ] Exportação para e-book (EPUB)
- [ ] Modo de apresentação para pitches

**Desenvolvido para escritores de fantasia urbana**

*"O verdadeiro poder está nas histórias que contamos"*

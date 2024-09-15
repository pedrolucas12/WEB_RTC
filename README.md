# Projeto Final da matéria Fundamento de Redes e Computadores

- FGA0211 - FUNDAMENTOS DE REDES DE COMPUTADORES - T01 (2024.1 - 24T45)
- **Professor**: Fernando William Cruz
- **Alunos**:
  - João Manoel Barreto Neto - 211039519
  - Pablo Guilherme de Jesus Batista Silva - 200025791
  - Pedro Lucas Garcia - 190115548
  - Weslley Alves de Barros - 200044567

## Introdução

O projeto desenvolvido na disciplina tem como objetivo criar uma aplicação de videoconferência utilizando as tecnologias WebRTC e Firebase. A escolha dessas ferramentas visa proporcionar uma comunicação em tempo real eficiente e segura, explorando as principais funcionalidades necessárias para um sistema de videoconferência, como transmissão de áudio, vídeo e sinalização entre os usuários.

## WebRTC

WebRTC (Web Real-Time Communication) é uma tecnologia que permite a comunicação em tempo real entre navegadores e dispositivos móveis através de APIs simples. Ele possibilita a troca direta de áudio, vídeo e dados entre os participantes, sem a necessidade de plugins ou softwares adicionais. Desenvolvida pelo W3C e pelo IETF, a WebRTC é uma solução moderna para criar aplicações de comunicação em tempo real, como videoconferências, compartilhamento de tela e chats interativos.

O principal benefício do WebRTC é sua capacidade de criar uma conexão peer-to-peer (P2P) entre os dispositivos, o que melhora a latência e a qualidade da comunicação. Através dessa conexão, os dados multimídia são transmitidos diretamente entre os usuários, evitando o uso de servidores centrais para o tráfego dos dados de áudio e vídeo. Isso resulta em uma redução no uso de banda e em maior eficiência.

No nosso projeto, o WebRTC será aplicado para realizar a transmissão de áudio e vídeo entre os participantes da conferência. Utilizamos a API para gerenciar a negociação de conexões, estabelecendo canais de mídia para garantir uma comunicação de alta qualidade. Além disso, a combinação com o Firebase permite a sinalização necessária para iniciar e encerrar as conexões entre os usuários, criando um sistema escalável e eficiente.

## Metodologia utilizada

A metodologia utilizada para o desenvolvimento do projeto foi baseada em um brainstorming inicial, onde discutimos as funcionalidades essenciais para uma aplicação de videoconferência. Foram levantadas questões como a necessidade de levantar a mão, destacar a câmera do usuário ativo, e a importância da estabilidade da conexão.

O desenvolvimento foi orientado à solução de issues levantadas durante essas discussões. Cada funcionalidade foi pensada para atender às necessidades dos usuários em um ambiente de conferência online. Priorizamos a implementação de recursos que garantissem uma boa experiência de uso, focando na resolução de problemas práticos e técnicos, como a gestão de conexões e a qualidade da transmissão.

## Descrição da arquitetura da aplicação

A aplicação de videoconferência é construída utilizando **WebRTC** para comunicação em tempo real, **Firebase** para persistência e gerenciamento de dados, e uma interface de usuário composta por **Bootstrap** e **Material Design**. A seguir está uma visão geral dos principais componentes e como eles interagem:

---

### 1. **Interface do Usuário (UI)**

O **`index.html`** define a estrutura principal da interface do usuário e integra tanto o **Material Design** quanto o **Bootstrap** para fornecer uma experiência de usuário moderna e responsiva.

- **Navbar**: Exibe a marca da aplicação e inclui a funcionalidade de colapsar para dispositivos móveis.
  
- **Botões principais**:
  - `cameraBtn`: Solicita permissão do usuário para acessar a câmera e o microfone, ativando a comunicação de mídia necessária para WebRTC.
  - `createBtn` e `joinBtn`: Inicialmente desativados, são habilitados após o usuário permitir o acesso à câmera e ao microfone. Eles são responsáveis por criar ou ingressar em uma sala de videoconferência.
  - `hangupBtn`: Usado para encerrar a chamada.
  
- **Área de Vídeo**:
  - Exibe dois elementos de vídeo, `localVideo` e `remoteVideo`, para mostrar o feed de vídeo do usuário e de outros participantes na sala.

- **Sala e ID da Sala**:
  - A aplicação permite a criação de salas com um `roomId` único. Esse ID pode ser copiado e compartilhado para que outros usuários possam ingressar na mesma videoconferência.

---
### 3. **Firebase**: Gerenciamento de Dados

O **Firebase Firestore** é utilizado para persistir as salas e gerenciar a sinalização entre os participantes da chamada. O Firestore armazena:

- **IDs das salas**: Quando um usuário cria uma sala, o `roomId` é salvo no Firestore, permitindo que outros participantes acessem a mesma sala ao usar esse ID.
  
- **Mensagens de Sinalização**: As mensagens de sinalização (ofertas, respostas e candidatos ICE) são trocadas por meio do Firestore para facilitar a comunicação WebRTC entre os usuários.

---

### 2. **WebRTC**: Comunicação em Tempo Real

O **WebRTC** é a base da comunicação de vídeo e áudio entre os usuários. O fluxo principal envolve:

- **Captura de Mídia**: Ao clicar no botão "Permitir acesso à câmera e microfone", a aplicação utiliza a API `getUserMedia` do navegador para capturar o vídeo e o áudio do usuário. Esse fluxo de mídia é exibido no elemento `localVideo` e, posteriormente, compartilhado com outros participantes.

- **Conexões Peer-to-Peer (P2P)**: Após a criação de uma sala, o WebRTC estabelece conexões diretas entre os clientes, permitindo a troca de fluxos de áudio e vídeo em tempo real. Esse processo é facilitado pela troca de "ofertas" e "respostas" SDP (Session Description Protocol) entre os pares.

---

### 4. **WebSocket**: Chat em Tempo Real

A aplicação também inclui uma funcionalidade de **chat em tempo real**:

- **WebSocket**: A comunicação de mensagens entre os usuários é feita via WebSocket, o que garante a troca rápida de mensagens.
- **Interface de Chat**: A interface de chat permite que os usuários enviem e recebam mensagens durante a videoconferência, com as mensagens sendo exibidas no elemento `chatbox`.

---

### 5. **Funcionalidade de Compartilhamento de Tela**

A aplicação oferece um botão para **compartilhamento de tela**. Ao clicar no botão "Compartilhar Tela", a aplicação utiliza a API `getDisplayMedia` para capturar a tela do usuário e transmitir o conteúdo aos outros participantes.

---

### 6. **Levantando a Mão**

A funcionalidade de **levantar a mão** pode ser implementada com um botão que envia um sinal visual aos demais participantes de que um usuário deseja falar. Embora o HTML atual não tenha o botão ativado, ele pode ser facilmente adicionado e conectado à lógica WebRTC e Firebase para sinalizar quando um participante "levanta a mão".

---

### 7. **Controle de Mídia**

A aplicação inclui controles de mídia para **ativar/desativar a câmera** e **mutar o microfone**. Esses botões permitem que os usuários gerenciem seus próprios fluxos de mídia sem interromper a chamada.

---

### 8. Ciclo de vida da conexão

1. **Iniciar mídia local**: O usuário inicializa sua mídia local (áudio e vídeo) ao clicar no botão da câmera. Isso ativa a captura de mídia e a exibição dos vídeos locais e remotos.

2. **Criar ou juntar-se a uma sala**: O usuário pode criar uma sala ou se juntar a uma sala existente. Ao criar, o sistema gera uma oferta SDP e a armazena no Firestore. Ao se juntar, o receptor recupera a oferta e envia uma resposta SDP.

3. **Troca de candidatos ICE**: Tanto o chamador quanto o receptor coletam seus candidatos ICE e os trocam por meio do Firestore, o que garante a conectividade entre os pares.

4. **Encerrar a chamada**: Ao encerrar a chamada, o usuário para as trilhas de mídia e fecha a conexão WebRTC. A sala e os candidatos ICE são removidos do Firestore para liberar recursos.

### Resumo

Essa arquitetura combina as capacidades do WebRTC, Firebase e WebSockets para criar uma solução completa de videoconferência em tempo real. A interface moderna, construída com Bootstrap e Material Design, proporciona uma experiência de usuário simples e eficiente, enquanto os controles de mídia e funcionalidades adicionais, como chat e compartilhamento de tela, garantem uma comunicação rica e interativa.

### Como rodar

## Conclusão

## Video de apresentação
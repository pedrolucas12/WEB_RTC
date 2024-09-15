# Projeto Final da matéria Fundamento de Redes e Computadores

- FGA0211 - FUNDAMENTOS DE REDES DE COMPUTADORES - T01 (2024.1 - 24T45)
- **Professor**: Fernando William Cruz
- **Alunos**:
  - João Manoel Barreto Neto - 211039519
  - Pablo Guilherme de Jesus Batista Silva - 200025791
  - Pedro Lucas Figueiredo Santana - 202017049
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

A funcionalidade de levantar a mão é implementada com um botão que utiliza o mesmo sistema de comunicação via WebSocket, assim como o chat. Quando um usuário clica no botão de levantar a mão, uma mensagem é enviada e exibida no elemento `chatbox`, informando aos demais participantes que o usuário levantou a mão e deseja falar.

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

1. **Pré-requisitos**:

   - Você precisa do npm instalado em sua máquina. Para verificar se tem o npm, basta rodar o comando : `npm -v`. Caso nao tenha, para instalar o npm, siga as instruções em [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm).
   - Instale o Firebase CLI com o comando: `npm install -g firebase-tools`.

2. **Clonar o repositório**:

   - Clone o repositório do projeto em sua máquina local:
     ```bash
     git clone https://github.com/pedrolucas12/WEB_RTC.git
     ```

3. **Acessar a pasta do projeto**:

   - Acesse a pasta do projeto:
     ```bash
     cd WEB_RTC
     ```

4. **Instalar as dependências**:

   - Instale as dependências do projeto com o comando:
     ```bash
     npm install
     ```

5. **Inicializar o Firebase**:

   - Acesse o console do Firebase em [https://console.firebase.google.com/](https://console.firebase.google.com/).
   - Crie um novo projeto e adicione um aplicativo da web.
   - Ativar o Cloud Firestore. No console do Firebase, vá em Desenvolver > Firestore. Clique em Criar banco de dados, escolha Modo de teste e ative.
   - Associe o Projeto Firebase ao projeto local com os comandos:
     ```bash
     firebase login
     ```
     ```bash
     firebase use --add
     ```

6. **Rodar o projeto**:
   - Agora que o projeto está configurado, você pode executar o servidor local do Firebase Hosting com o comando:
   ```bash
   firebase serve --only hosting
   ```
   - O servidor local será iniciado e você poderá acessar a aplicação em [http://localhost:5000](http://localhost:5000).

## Conclusão

O desenvolvimento deste projeto foi uma jornada de muito aprendizado e experimentação com tecnologias modernas que são amplamente usadas em aplicações de comunicação em tempo real. Utilizamos o **WebRTC** como a base para a transmissão de áudio e vídeo entre os usuários, aproveitando sua capacidade de criar conexões P2P eficientes e de baixa latência. A integração com o **Firebase** facilitou a sinalização necessária para a comunicação entre os pares, além de oferecer uma solução confiável para o gerenciamento das salas de conferência.

Além disso, exploramos o uso de **WebSocket** para implementar o chat em tempo real, permitindo uma experiência mais rica e interativa para os usuários. A interface foi construída com **Bootstrap** e **Material Design**, garantindo uma UI moderna e responsiva, que se adapta bem a diferentes dispositivos e tamanhos de tela.

Durante o projeto, aprendemos bastante sobre as particularidades de comunicação P2P, como a troca de ofertas e respostas SDP, o processo de negociação ICE, e os desafios de manter a qualidade de mídia em diferentes condições de rede. Também aprimoramos nossas habilidades em trabalhar com APIs de navegadores, como `getUserMedia` e `getDisplayMedia`, que foram fundamentais para capturar e compartilhar o vídeo e o áudio dos usuários.

Esse projeto não só nos permitiu consolidar os conceitos teóricos de redes de computadores, como também nos deu a oportunidade de criar uma aplicação prática que poderia ser usada em um cenário real. Aprendemos a lidar com problemas de latência, gestão de conexões e a importância de criar uma interface intuitiva para o usuário final. Foi uma experiência desafiadora, mas extremamente recompensadora, que nos preparou melhor para futuros projetos na área de desenvolvimento de software e redes.

## Video de apresentação

```

```

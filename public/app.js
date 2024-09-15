mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;
let nameId = null;
let contentId = null;
let muteState = false;
let screenState = false;
let contentExists = false;
let contentShown = false;
let captureStream = null;


function init() {
  document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

async function createRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;
  const db = firebase.firestore();
  const roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    'offer': {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
  document.querySelector(
      '#currentRoom').innerText = `Current room is `;
  document.querySelector(
      '#currentId').innerText = `${roomRef.id}`
  // Code for creating a room above

  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}

function joinRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').
      addEventListener('click', async () => {
        roomId = document.querySelector('#room-id').value;
        console.log('Join room: ', roomId);
        document.querySelector(
            '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
        await joinRoomById(roomId);
      }, {once: true});
  roomDialog.open();
}

async function joinRoomById(roomId) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      calleeCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRef.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listening for remote ICE candidates above
  }
}

async function openUserMedia(e) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  console.log('Stream:', stream); // Verifique se o stream está sendo capturado corretamente
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('localStream:', localStream); // Verifique se a stream tem áudio e vídeo

  document.querySelector('#cameraBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;

  // Tornar os botões de "Toggle Camera" e "Toggle Mic" visíveis
  document.querySelector('#toggleCameraBtn').style.display = 'inline-block';
  document.querySelector('#toggleMicBtn').style.display = 'inline-block';
}

async function hangUp(e) {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;
  document.querySelector('#cameraBtn').disabled = false;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';
  document.querySelector('#currentId').innerText = '';

  // Delete room on hangup
  if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }

  document.location.reload(true);
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

document.querySelector('#toggleCameraBtn').addEventListener('click', toggleCamera);
//document.querySelector('#toggleMicBtn').addEventListener('click', toggleMic);

function toggleCamera() {
  if (!localStream) {
      console.error("Local stream is not available.");
      return;
  }
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      document.querySelector('#toggleCameraBtn i').textContent = videoTrack.enabled ? 'videocam' : 'videocam_off';
  }
}
function muteToggleEnable() {
  const muteButton = document.querySelector('#muteButton');
  
  // Certifique-se de que o botão mute existe
  if (!muteButton) {
    console.error('Botão mute não encontrado.');
    return;
  }

  // Adiciona o event listener ao botão de mute
  muteButton.addEventListener('click', () => {
    if (!localStream) {
      console.error("Stream local não disponível.");
      return;
    }
    
    const audioTracks = localStream.getAudioTracks();
    
    if (audioTracks.length === 0) {
      console.error("Nenhuma faixa de áudio encontrada.");
      return;
    }

    const audioTrack = audioTracks[0];

    if (!muteState) {
      console.log("Muting");
      muteState = true;
      audioTrack.enabled = false; // Desativa o áudio
      muteButton.innerText = "mic_off"; // Atualiza o ícone
      muteButton.classList.add('toggle'); // Adiciona a classe de mutado
    } else {
      console.log("Unmuting");
      muteState = false;
      audioTrack.enabled = true; // Ativa o áudio
      muteButton.innerText = "mic"; // Atualiza o ícone
      muteButton.classList.remove('toggle'); // Remove a classe de mutado
    }
  });
}

// Chame essa função após garantir que localStream foi inicializado
muteToggleEnable();

document.addEventListener('DOMContentLoaded', function() {
  const sendButton = document.getElementById('sendButton');
  const messageInput = document.getElementById('messageInput');
  const messagesDiv = document.getElementById('messages');

  function sendMessage() {
    const message = messageInput.value;
    if (message.trim() === '') return;

    const formattedMessage = `${username}: ${message}`;
    ws.send(formattedMessage); // Enviar como string

    const li = document.createElement('li');
    li.textContent = `Você: ${message}`;
    li.classList.add('you');
    messages.appendChild(li);

    messageInput.value = '';
    scrollToBottom();
  }

  sendButton.addEventListener('click', sendMessage);

  // Enviar mensagem ao pressionar Enter
  messageInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          sendMessage(); // Chama a função diretamente
      }
  });
});

function toggleOnContent(roomRef) {
  document.getElementById('localVideo').srcObject = captureStream;
  document.getElementById('screenShareButton').innerText = "stop_screen_share";
  document.getElementById('screenShareButton').classList.add('toggle');
  signalContentShare(roomRef);
  screenState = true;
  captureStream.getVideoTracks()[0].onended = () => {
    contentToggleOff(roomRef);
  }
}

async function startScreenShare() {
  try {
      captureStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
      });
      document.querySelector('#localVideo').srcObject = captureStream;
      document.querySelector('#screenShareButton').innerText = "stop_screen_share";
      document.querySelector('#screenShareButton').classList.add('toggle');
      screenState = true;
      captureStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
      };
  } catch (err) {
      console.error("Failed to share screen:", err);
  }
}

function stopScreenShare() {
  if (captureStream) {
      captureStream.getTracks().forEach(track => track.stop());
      captureStream = null;
      document.querySelector('#screenShareButton').innerText = "screen_share";
      document.querySelector('#screenShareButton').classList.remove('toggle');
      screenState = false;
  }
}

// Adiciona o event listener ao botão de compartilhar tela
document.querySelector('#screenShareButton').addEventListener('click', () => {
  if (screenState) {
      stopScreenShare();
  } else {
      startScreenShare();
  }
});


init(); 
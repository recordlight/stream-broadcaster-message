const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);



let dialogElement = document.getElementById("dialog-box");
let mainChannel = urlParams.get('channel');
let messageExist = false;



const opts = {
	options: { debug: true },
    channels: [mainChannel]
  };

const client = new tmi.Client( opts );
client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  console.log(channel);
  console.log(tags.username);
  console.log(mainChannel === channel);
	if(mainChannel === tags.username) {
    resetAnimation();
    dialogElement.innerHTML = getMessageHTML(message, tags);
	}
});


function resetAnimation() {
  dialogElement.style.animation = 'none';
  dialogElement.offsetHeight; /* trigger reflow */
  dialogElement.style.animation = null; 
}

function getMessageHTML(message, { emotes }) {
  console.log(message);
  console.log(emotes);
  if (!emotes) return message;

  // store all emote keywords
  // ! you have to first scan through 
  // the message string and replace later
  const stringReplacements = [];

  // iterate of emotes to access ids and positions
  Object.entries(emotes).forEach(([id, positions]) => {
    // use only the first position to find out the emote key word
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/2.0">`,
    });
  });

  // generate HTML and replace all emote keywords with image elements
  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      // obs browser doesn't seam to know about replaceAll
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}
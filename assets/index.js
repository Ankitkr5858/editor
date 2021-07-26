(function () {
  // Form element
  var formElem = document.querySelector('#form');
  var oDoc = document.querySelector('#textBox');
  var activeBold = false;
  var activeItalic = false;
  var activeUnderline = false;
  var docMode = false;

  // when input, check has cat meme
  oDoc.addEventListener('input', checkHasMeme);
  formElem.addEventListener('submit', function () {
    if (validateMode()) {
      document.querySelector('#myDoc').value = oDoc.innerHTML;
      return true;
    }
    return false;
  });

  // When click buttons in the toolbar
  document.querySelector('#boldBtn').addEventListener('click', function () {
    // activeBold = !activeBold;
    // this.style.background = activeBold ? '#ddd' : '#fff';
    formatDoc('bold');
  });
  document.querySelector('#italicBtn').addEventListener('click', function () {
    // activeItalic = !activeItalic;
    // this.style.background = activeItalic ? '#ddd' : '#fff';
    formatDoc('italic');
  });
  document.querySelector('#underlineBtn').addEventListener('click', function () {
    // activeUnderline = !activeUnderline;
    // this.style.background = activeUnderline ? '#ddd' : '#fff';
    formatDoc('underline');
  });
  document.querySelector('#linkBtn').addEventListener('click', function () {
    var Link = prompt('Write the URL here', 'http:\/\/');
    if (Link && Link != '') formatDoc('createlink', Link);
  });
  document.querySelector('#imgLinkBtn').addEventListener('click', function () {
    var imgLink = prompt('Write the Image URL here', 'http:\/\/');
    if (imgLink && imgLink != '') formatDoc('insertImage', imgLink);
  });
  document.querySelector('#codeBtn').addEventListener('click', function () { setDocMode(); });
  document.querySelector('#saveBtn').addEventListener('click', function () { formatDoc('attachFile'); });

  // When dom content is ready
  initDoc();

  // This function set default value
  function initDoc() {
    toggleCodeBtn('show');
    toggleLoader('hide');
  }

  function toggleLoader(toggle) {
    document.querySelector('#loader').style.display = toggle === 'show' ? 'block' : 'none';
  }

  function toggleCodeBtn(toggle) {
    var codeOnElem = document.querySelector('#code_on');
    var codeOffElem = document.querySelector('#code_off');
    if (toggle === 'show') {
      codeOnElem.style.display = 'block';
      codeOffElem.style.display = 'none';
      return;
    }

    codeOnElem.style.display = 'none';
    codeOffElem.style.display = 'block';
  }

  // This function set Bold, Italic, Underline and other editor functionallity
  function formatDoc(command, value) {
    oDoc.focus();
    if (!validateMode()) return;

    if (command === 'insertImage') {
      document.execCommand('insertHTML', false, '<img src="' + value + '" width="100px"/>');
      return;
    }

    document.execCommand(command, false, value);
  }

  // Checking text mode is enable.
  function validateMode() {
    if (!docMode) return true;
    alert("Kinldy swtich to text mode");
    oDoc.focus();
    return false;
  }


  function setDocMode() {
    docMode = !docMode;
    var oContent;
    if (docMode) {
      toggleCodeBtn('hide');
      oContent = document.createTextNode(oDoc.innerHTML);
      oDoc.innerHTML = "";
      oDoc.appendChild(oContent);
      oPre.focus();
      return;
    }

    toggleCodeBtn('show');
    oDoc.innerHTML = oDoc.innerText;
    oDoc.contentEditable = true;
    oDoc.focus();
  }

  // Check and fetch Cat Meme Data
  function checkHasMeme() {
    var reg = /{{cat_meme}}/g;
    var baseUrl = 'https://cataas.com/';
    if (!reg.test(oDoc.innerText)) return false;

    toggleLoader('show');
    var xhttp = new XMLHttpRequest();

    // Define a callback function
    xhttp.onload = function () {
      // Here you can use the Data
      try {
        var catMemeObj = JSON.parse(this.response);
        console.log(catMemeObj);
        oDoc.innerHTML = oDoc.innerHTML.replace(reg, '<img src=' + baseUrl + catMemeObj.url + ' width="100px">');
        setTimeout(() => {
          toggleLoader('hide');
        }, 500);
      } catch (error) {

      }
    };

    // Send a request
    xhttp.open("GET", baseUrl + "cat?json=true");
    xhttp.send();
    return true;
  }
})();
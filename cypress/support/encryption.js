class encryption {
  // this methode encodes a string
  encode(string) {
    const passPhrase = 5;
    let encodedString = "";

    for (let i = 0; i < string.length; i++) {
      let ch = string[i];
      let code = ch.charCodeAt(0);

      if (code >= 97 && code <= 122) { // a–z
        let shifted = ((code - 97 + passPhrase) % 26) + 97;
        encodedString += String.fromCharCode(shifted);
      } else {
        // Non-lowercase letter, leave unchanged
        encodedString += ch;
      }
    }

    return encodedString;
  }

  // this method decodes a string
  decode(codedString) {
    const passPhrase = 5;
    let decodedString = "";

    for (let i = 0; i < codedString.length; i++) {
      let ch = codedString[i];
      let code = ch.charCodeAt(0);

      if (code >= 97 && code <= 122) { // a–z
        let shifted = ((code - 97 - passPhrase + 26) % 26) + 97;
        decodedString += String.fromCharCode(shifted);
      } else {
        // Non-lowercase letter, leave unchanged
        decodedString += ch;
      }
    }

    return decodedString;
  }
}

export const crypt = new encryption();
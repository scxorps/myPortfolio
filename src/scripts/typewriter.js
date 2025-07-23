function initTypewriter() {
  // Attendre que ScrollReveal ait fini son animation
  setTimeout(function() {
    const element = document.getElementById('typewriter');
    const cursor = document.getElementById('cursor');
    
    if (!element || !cursor) {
      console.error('Typewriter elements not found');
      return;
    }
    
    console.log('Typewriter element found, starting effect...');
    
    const text1 = "I'm not famous";
    const text2 = ", Just Effective";
    let index = 0;
    element.textContent = "";
    
    // Fonction pour taper la première partie
    function typeFirstPart() {
      if (index < text1.length) {
        element.textContent += text1.charAt(index);
        index++;
        setTimeout(typeFirstPart, 120); // 120ms entre chaque lettre
      } else {
        console.log('First part done, waiting 2 seconds...');
        // Attendre 2 secondes puis taper la deuxième partie
        setTimeout(typeSecondPart, 2000);
      }
    }
    
    // Fonction pour taper la deuxième partie
    function typeSecondPart() {
      console.log('Starting second part...');
      let index2 = 0;
      
      function addNextChar() {
        if (index2 < text2.length) {
          element.textContent += text2.charAt(index2);
          index2++;
          setTimeout(addNextChar, 120);
        } else {
          console.log('Typewriter effect completed!');
        }
      }
      
      addNextChar();
    }
    
    // Commencer l'effet immédiatement
    typeFirstPart();
    
  }, 500); // Attendre 500ms pour que la page soit chargée
}

export default initTypewriter;

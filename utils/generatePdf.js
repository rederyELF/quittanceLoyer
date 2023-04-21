import jsPDF from 'jspdf';

function getFirstAndLastDayOfMonth(date) {
    // Récupérer le mois et l'année de la date passée en paramètre
    const month = date.getMonth();
    const year = date.getFullYear();
  
    // Créer une nouvelle date pour le premier jour du mois
    const firstDayOfMonth = new Date(year, month, 1);
  
    // Récupérer le mois suivant
    const nextMonth = (month === 11) ? 0 : month + 1;
  
    // Créer une nouvelle date pour le dernier jour du mois en cours
    const lastDayOfMonth = new Date(year, nextMonth, 0);
  
    // Formater les dates en "dd/mm/yyyy"
    const formattedFirstDay = `${("0" + firstDayOfMonth.getDate()).slice(-2)}/${("0" + (firstDayOfMonth.getMonth() + 1)).slice(-2)}/${firstDayOfMonth.getFullYear()}`;
    const formattedLastDay = `${("0" + lastDayOfMonth.getDate()).slice(-2)}/${("0" + (lastDayOfMonth.getMonth() + 1)).slice(-2)}/${lastDayOfMonth.getFullYear()}`;
  
    // Renvoyer un objet avec les deux dates formatées
    return {
      firstDay: formattedFirstDay,
      lastDay: formattedLastDay
    };
  }

  function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `Quittance-de-loyer-${year}-${month}-${day}`;
  }

  function transformerDate(date) {
    // Séparation des composantes de la date
    var composantes = date.split("-");
    var annee = composantes[0];
    var mois = composantes[1];
    var jour = composantes[2];
  
    // Retour de la date transformée
    return jour + "/" + mois + "/" + annee;
  }
  


function templatePDF(nom, prenom, nomLocation, prenomLocation, adresse, image, codePostal, ville,  date, ownerLocation, datePayment, loyerAmount, chargesAmount, doneAt, doneDate, sign, dayMonth) {
  const doc = new jsPDF();
    /// Définit la police du titre en gras et en gros
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);

    // Centre le titre
    const title = 'Quittance de loyer';
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;

    // Définit la longueur des traits en fonction de la largeur du titre et ajoute de l'espace
    const lineWidth = titleWidth + 40;

    // Ajoute un trait au-dessus du titre avec de l'espace
    doc.setLineWidth(1);
    doc.line(titleX - 20, 20, titleX + titleWidth + 20, 20);

    // Ajoute un trait en-dessous du titre avec de l'espace
    doc.line(titleX - 20, 35, titleX + titleWidth + 20, 35);

    // Ajoute le titre avec de l'espace
    doc.text(title, titleX, 30);

    // Réinitialise la police pour le contenu du formulaire
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);


    // Ajoute de l'espace avant le contenu du formulaire
    doc.text('', 20, 40);
    // Ajoute le contenu au PDF
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Quittance de loyer du mois du : ${dayMonth.lastDay ? dayMonth.lastDay : transformerDate(date)}`, 20, 50, { underline: true });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Adresse de location : `, 20, 60, { underline: true });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.text(`${adresse}`, 20, 70);
    doc.text(`${codePostal} ${ville}`, 20, 75);


    doc.text(`Je soussigné ${prenom} ${nom} propriétaire du logement désigné ci-dessus, déclare avoir reçu de `, 20, 90);
    //$
    doc.text(`${nomLocation} ${prenomLocation} la somme de ${(parseInt(loyerAmount) + parseInt(chargesAmount))} euros au titre du paiement du loyer et `, 20, 95);
    doc.text(`des charges pour la période de location du ${dayMonth.firstDay} au ${dayMonth.lastDay} `, 20, 100);
    doc.text(`et lui en donne quittance, sous réserve de tous mes droits.`, 20, 105);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Détail du réglement : `, 20, 120);
    // Réinitialise la police pour le contenu suivant
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
        
    doc.text(`Loyer (Hors charges): ${loyerAmount} euros`, 20, 130);
    doc.text(`Provision pour charge: ${chargesAmount} euros`, 20, 135);
    doc.text(`Total: ${(parseInt(loyerAmount) + parseInt(chargesAmount))} euros`, 20, 140);

    doc.text(`Date du paiement: ${dayMonth.midDate ? dayMonth.midDate : transformerDate(datePayment)}`, 20, 150);
    doc.text(`Fait à: ${doneAt} le ${transformerDate(doneDate)}`, 20, 160);

    doc.text(`Signature : `, 20, 170);

    // Ajoute l'image si elle existe
    if(sign){
        doc.addImage(sign, 'jpeg', 20, 180, 50, 50);
    } else if (image) {
        doc.addImage(image, 'jpeg', 20, 180, 50, 50);
    } 

    doc.setFontSize(9);
    //Cette quittance annule tous les reçus qui auraient pu être établis précédemment en cas de paiement partiel du montant du présent terme. Elle est à conserver pendant trois ans par le locataire (article 7-1 de la loi n° 89-462 du 6 juillet 1989).
    doc.text(`Cette quittance annule tous les reçus qui auraient pu être établis précédemment en cas de paiement`, 20, 240);
    doc.text(`partiel du montant du présent terme. Elle est à conserver pendant trois ans par le locataire`, 20, 245);
    doc.text(`(article 7-1 de la loi n° 89-462 du 6 juillet 1989).`, 20, 250);
    // Sauvegarde le PDF en tant que fichier
    doc.save(getCurrentDate());
}


// Récupère les valeurs du formulaire et génère le PDF
export const generatePdf = ({ nom, prenom, nomLocation, prenomLocation, adresse, image, codePostal, ville,  date, ownerLocation, datePayment, loyerAmount, chargesAmount, doneAt, doneDate, sign, dateRange, dateRangeArray}) => {
  //console.log(nom, prenom, nomLocation, prenomLocation, adresse, image, codePostal, ville,  date, ownerLocation, datePayment, loyerAmount, chargesAmount, doneAt, doneDate, sign, dateRangeArray)  
  if (dateRangeArray && dateRangeArray.length > 0) {
      for (const dateRange of dateRangeArray) {
        console.log(dateRange);
        templatePDF(nom, prenom, nomLocation, prenomLocation, adresse, image, codePostal, ville,  date, ownerLocation, datePayment, loyerAmount, chargesAmount, doneAt, doneDate, sign, dateRange)
        //console.log(`Période du : ${(dateRange.firstDay)} - ${(dateRange.lastDay)}`);
      }
    } else {
      var dayMonth = getFirstAndLastDayOfMonth(new Date(datePayment));
      templatePDF(nom, prenom, nomLocation, prenomLocation, adresse, image, codePostal, ville,  date, ownerLocation, datePayment, loyerAmount, chargesAmount, doneAt, doneDate, sign, dayMonth)

      console.log("On lance en normal");
    }
  
   
};


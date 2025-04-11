$(document).ready(function () {
    $('#contactToggle').click(function () {
      const toggleText = $(this).find('.toggle-text');

      $('#contactInfo').toggle(300);

      if (toggleText.text().trim() === '+ Show Contact') {
        toggleText.text('- Hide Contact');
      } else {
        toggleText.text('+ Show Contact');
      }
    });
  });

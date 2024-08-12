$(function() { 
  $('#navigation').slimmenu(
  {
      resizeWidth: '767',
      collapserTitle: '',
      animSpeed: 'medium',
      easingEffect: null,
      indentChildren: false,
      childrenIndenter: '&nbsp;',
  });
});


$(function(){
  $(window).scroll(function(){
    var sticky = $('.header'),
        scroll = $(window).scrollTop();

    if (scroll >= 100) sticky.addClass('fixed');
    else sticky.removeClass('fixed');
  });
});


new WOW().init();

$(document).ready(function(){ 
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 100) { 
            $('#scroll').fadeIn(); 
        } else { 
            $('#scroll').fadeOut(); 
        } 
    }); 
    $('#scroll').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 
});
// tdSwiper //
    var swiper0 = new Swiper(".tdSwiper", {
      slidesPerView: 4.15,
      spaceBetween: 24,
      loop: true,
      mousewheel: false,
      freeMode: false,
      // autoplay: {
      //   delay: 3500,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true,
      // },
      pagination: false,
      navigation: {
        nextEl: ".swiper-button-next0",
        prevEl: ".swiper-button-prev0",
      },
      breakpoints: { 
        0: { 
            spaceBetween: 10,
            slidesPerView: 1.15,
        },
        568: { 
            spaceBetween: 15,
            slidesPerView: 2.15,
        },
        768: { 
            spaceBetween: 18, 
            slidesPerView: 3.15,
        },
        1024: { 
            spaceBetween: 20, 
            slidesPerView: 3.15,
        },
        1200: { 
            spaceBetween: 24, 
            slidesPerView: 4.15,
        },
      }, 
      
    });

// 
// tdSwiper //
    var swiper0 = new Swiper(".ipcbSwiper", {
      slidesPerView: 8,
      spaceBetween: 0,
      loop: true,
      mousewheel: false,
      freeMode: false,
      // autoplay: {
      //   delay: 3500,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true,
      // },
      pagination: false,
      navigation: {
        nextEl: ".swiper-button-next1",
        prevEl: ".swiper-button-prev1",
      },
      breakpoints: { 
        0: { 
            slidesPerView: 2,
        },
        568: { 
            slidesPerView: 3,
        },
        768: { 
            slidesPerView: 4,
        },
        1024: { 
            slidesPerView: 6,
        },
        1200: { 
            slidesPerView: 8,
        },
      }, 
      
    });

// 

// FAQ Accordions //
const accordionBtns = document.querySelectorAll(".accordion");

accordionBtns.forEach((accordion) => {
  accordion.onclick = function () {
    this.classList.toggle("is-open");

    let content = this.nextElementSibling;

    if (content.style.maxHeight) {
      //this is if the accordion is open
      content.style.maxHeight = null;
    } else {
      //if the accordion is currently closed
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };
});


// 
$(document).ready(function() {
    $('.customSelect').select2();
});

// 
$( function() {
    $( ".datepicker" ).datepicker({
         numberOfMonths: 2,
         showOtherMonths: true,
         selectOtherMonths: true
    });
    $( ".format" ).on( "change", function() {
      $( ".datepicker" ).datepicker( "option", "mm/dd/yy", $( this ).val() );
    });
  } );

// 
$( ".customDD" ).selectmenu();
// 
$('.fc').on('focus blur change', function (e) {
    var $currEl = $(this);
  
  if($currEl.is('select')) {
    if($currEl.val() === $("option:first", $currEl).val()) {
        $('.cl', $currEl.parent()).animate({opacity: 0}, 240);
      $currEl.parent().removeClass('focused');
    } else {
        $('.cl', $currEl.parent()).css({opacity: 1});
        $currEl.parents('.fac').toggleClass('focused', ((e.type === 'focus' || this.value.length > 0) && ($currEl.val() !== $("option:first", $currEl).val())));
    }
  } else {
    $currEl.parents('.fac').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
  }
}).trigger('blur');
// 
// $('html').click(function() {
//     $('.travellerCount').hide();
//  })

 $('.trvlr').click(function(e){
     e.stopPropagation();
 });

// $('.trvlrInpt').click(function(e) {
//  $(this).siblings('.travellerCount').toggle();
// });
//
$('.sbt').click(function(e){
  $(this).parent().toggleClass('closed');
  // $(this).next(".sbBlock").slideToggle();
});

// 
$( function() {
    var availableTags = [
      "Aberdeen, SD (ABR)",
      "Abilene, TX (ABI)",
      "Adak Island, AK (ADK)",
      "Akiachak, AK (KKI)",
      "Akiak, AK (AKI)",
      "Bakersfield, CA (BFL)",
      "Baltimore, MD (BWI)",
      "Bangor, ME (BGR)",
      "Bar Harbour, ME (BHB)"
    ];
    $( ".tags" ).autocomplete({
      source: availableTags
    });
  } );
// 
const buttons = document.querySelectorAll(".tcButton");
const minValue = 0;
const maxValue = 10;

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // 1. Get the clicked element
    const element = event.currentTarget;
    // 2. Get the parent
    const parent = element.parentNode;
    // 3. Get the number (within the parent)
    const numberContainer = parent.querySelector(".number");
    const number = parseFloat(numberContainer.textContent);
    // 4. Get the minus and plus buttons
    const increment = parent.querySelector(".plus");
    const decrement = parent.querySelector(".minus");
    // 5. Change the number based on click (either plus or minus)
    const newNumber = element.classList.contains("plus")
      ? number + 1
      : number - 1;
    numberContainer.textContent = newNumber;
    // 6. Disable and enable buttons based on number value (and undim number)
    if (newNumber === minValue) {
      decrement.disabled = true;
      numberContainer.classList.add("dim");
      // Make sure the button won't get stuck in active state (Safari)
      element.blur();
    } else if (newNumber > minValue && newNumber < maxValue) {
      decrement.disabled = false;
      increment.disabled = false;
      numberContainer.classList.remove("dim");
    } else if (newNumber === maxValue) {
      increment.disabled = true;
      numberContainer.textContent = `${newNumber}+`;
      element.blur();
    }
  });
});
// 
$( function() {
    $( ".ctcMain input, .rdoNoIcon input, .ipcbInpt input" ).checkboxradio({
      icon: false
    });
  } );


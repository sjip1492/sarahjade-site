function elementInViewport(i) {
    var bounding = i.getBoundingClientRect();
    var myElementHeight = i.offsetHeight;
    var myElementWidth = i.offsetWidth;

    if (bounding.top >= -myElementHeight 
        && bounding.left >= -myElementWidth
        && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + myElementWidth
        && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + myElementHeight) {
        return true;
    } else {
        return false;
    }
}

$(document).ready(function () {
  var scroll_objs = $('.fade-in-scroll');
  var hidden_scroll_objs = new Array();
  
  for (var scroll_obj of scroll_objs) {
    if (elementInViewport(scroll_obj)) {
        $(scroll_obj).animate({ 'opacity': '1' }, 1000);
    } else {
        hidden_scroll_objs.push($(scroll_obj));
    }
  }

  $(window).scroll(function () {
    for (var h_scroll_obj of hidden_scroll_objs) {
      if (elementInViewport(h_scroll_obj[0])) {
        $(h_scroll_obj).animate({ 'opacity': '1' }, 1000);
      }
    } 
  });
});
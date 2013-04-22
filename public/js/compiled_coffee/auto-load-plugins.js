
$(function() {
  $('select.chosen').chosen({
    disable_search: true
  });
  $('select.chosen-search').chosen({});
  return $('select.chosen-always-visible').each(function() {
    var chosen, _;
    _ = $(this);
    _.chosen({});
    chosen = _.data('chosen');
    chosen.container_mousedown();
    chosen.close_field = function() {
      return $(document).unbind('click', chosen.click_test_action);
    };
    return chosen.results_hide = function() {
      chosen.search_field.val('');
      return chosen.results_show();
    };
  });
});

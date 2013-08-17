$("#dashboard1 [data-slider]")

     .each(function () {
         var input = $(this);
         $("<span>")
           .addClass("output")
           .insertAfter($(this));
     })
     .bind("slider:ready slider:changed", function (event, data) {

         //$("#dashboard3 .velocity").text(data.value.toFixed(0));

         var newleft = (data.value.toFixed(0) + "px");
         var el = $("#spaceship");

         el.css('margin-left', data.value.toFixed(0) + 'px');

         //elete.css({ marginLeft: elete, marginRight: "200px" });

         //alert(elete);
         //elete.style["margin-left"] = newleft;

         //$(this)
         //  .nextAll(".output:first")
         //    .html(data.value.toFixed(0));
     });

/*=========================================================================
*Developer:Make Cents
*Date: 5/25/2017
*UCSD Code Bootcamp: HW #18
==========================================================================*/
var url = window.location.search;
const limit = 50;

//single object to control the DOM
var news = {
    init: function() {  
        this.cacheDom();
        this.bindEvents();
    },
    cacheDom: function () {
        
        this.$noteBtn = $(".btn-info");
        this.$noteModal = $("#noteModal");
        this.$button = $("#myBtn");
        this.$modal = $("#myModal");
        this.$closeIt = $("#closeIt");
        this.$placeHolder = $("#placeHolder");

        // this.$burgers = $("#burgers");
        // this.$btns = $("#btns");
        // this.$eaten = $("#eaten");
    },
    bindEvents: function () {
        //listen to execute modal.
        this.$button.on("click", this.modalAppear.bind(this));
        $(document).on("click",".btn-info", this.modalAppear)
        this.$closeIt.on("click", this.hideModal);
        //$(document).on("click", ".btn-warning" , this.saveToDb.bind(this));
    }, 
    modalAppear: function () {
        console.log(news.$button.val());
        news.$noteModal.show();
    },
    hideModal: function () {
        news.$noteModal.hide();
    },
    saveToDb: function() {
        var thisId = $(this).attr("data-id");
        console.log(thisId);
        $.ajax({
            type: "GET",
            url: "/saveArticle/" + thisId
        });
        $(this).parents("div.well").remove();
        // getUnread(); 
    }, 
    deleteDocument: function() {
        var thisId = $(this).attr("data-id");
        console.log("delete this id: " + thisId);
        $.ajax({
            type: "GET",
            url: "/api/delete/" + thisId
        });
        $(this).parents("div.well").remove();
    },
    addNote: function (id) {
        var thisId = $(this).attr("data-id");
        console.log("delete this id: " + thisId);
        
    }
}
//when DOM is ready.
$( document ).ready(function() {
    console.log("about to init news, if you see this message, js file is linked.");
    news.init();
});
//listeners are outside of encapsulated obj - all good for now. Figure out why later. HW due soon.
$(document).on("click", ".btn-warning" , news.saveToDb);
$(document).on("click", ".btn-danger" , news.deleteDocument);
$(document).on("click", ".btn-success" , news.addNote);


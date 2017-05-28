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
        this.$closeItAgain = $("#closeItAgain");
        this.$placeHolder = $("#placeHolder");
    },
    bindEvents: function () {
        //listen to execute modal.
        this.$button.on("click", this.modalAppear.bind(this));
        $(document).on("click",".btn-info", this.modalAppear)
        this.$closeIt.on("click", this.hideModal);
        this.$closeItAgain.on("click", this.hideModalAgain);
        //$(document).on("click", ".btn-warning" , this.saveToDb.bind(this));
    }, 
    modalAppear: function () {
        $(this).parents(".button.btn-default").remove();
        var thisId = $(this).attr("data-id");
        console.log("id of article: " + thisId);
        //set the input of the id input to the article id , then submit it!
        $("#myNote").val(thisId)
        news.$noteModal.show();
    },
    hideModal: function () {
        news.$noteModal.hide();
    },
     hideModalAgain: function () {
        $("#displayNoteModal").hide();
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
    renderNote: function () {
        //remove old notes.
        $("#savedNotes").remove();
        var thisId = $(this).attr("data-id");
        $("#displayNoteModal").show();
        $.getJSON("/api/findNote/" + thisId, function(data) {
            console.log(data[0].body);
            var newH3 = $("<h3>" + data[0].body + "</h3>");
            newH3.attr("id", "savedNotes");
            $("#jumboArea").append(newH3);
        });
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
$(document).on("click", ".btn-secondary" , news.renderNote);


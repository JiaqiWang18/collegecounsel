var Controller = function () {

    var controller = {
        self: null,
        initialize: function () {
            self = this;
            console.log("runned controller")
            self.bindEvents();
            self.loadWelcome();
            self.renderSearchView();
            $(document).ajaxSend(function () {
                $("#overlay").fadeIn(300);
            });
        },

        bindEvents: function () {
            $('.tab-button').on('click', this.onTabClick);
            $('.setbtn').on('click',this.openSettings);
            $('.okbtn').on('click',function () {
                modal = document.getElementById("ttbox")
                modal.style.display = "none";
                var ifnever = $(".ifnever").is(":checked")
                if(ifnever){
                    localStorage.setItem("show",JSON.stringify(["nay"]))
                }

            });
        },

        onTabClick: function (e) {
            e.preventDefault();
            $("#overlay").hide();

            if ($(this).hasClass('active')) {
                return;
            }
            document.getElementById('explore-tab-button').style.pointerEvents = 'none';
            document.getElementById('build-tab-button').style.pointerEvents = 'none';
            document.getElementById('list-tab-button').style.pointerEvents = 'none';
            
            var tab = $(this).data('tab');
            if (tab === '#explore-tab') {
                self.renderSearchView();
            }
            else if (tab === '#build-tab') {
                self.rendeBuildView();
            }
            else {
                self.renderListView();
            }
        },

        openSettings:function(){
            var $tab = $('#tab-content');
            $tab.empty();
            $('.tab-button').removeClass('active');
            $("#tab-content").load("./views/settingmain.html",
            function () {
                $("#overlay").hide();
                $(".setbtn").prop('disabled', true);
                $(".setbtn").html("")
            })
        },

        loadWelcome:function(){
            var flag = JSON.parse(localStorage.getItem("show") || 'null')
            if (!flag){
                modal = document.getElementById("ttbox")
                modal.style.display = "block";

            }
        },

        renderSearchView: function () {

            $('.tab-button').removeClass('active');
            $('#explore-tab-button').addClass('active');
            $("#overlay").hide();

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/searchcollege.html",
                function () {
                    $("#overlay").hide();
                    $(".setbtn").html("About")
                    $(".setbtn").prop('disabled', false);

                    document.getElementById('explore-tab-button').style.pointerEvents = 'auto';
                    document.getElementById('build-tab-button').style.pointerEvents = 'auto';
                    document.getElementById('list-tab-button').style.pointerEvents = 'auto';
                    $.mobile.loading().hide();
                    $(".appname").text("Collegecounsel");
                    $("#overlay").hide();

                    $('.sortoptions').on('change', function () {
                        console.log("clicked")
                        var option = $('#searchform').find(":selected");
                        console.log(option.val())
                        self.loadcollegescard(option.val())
                    });
                    $("#overlay").hide();

                    self.loadcollegescard();

                });
        },

        loadcollegescard: function (sortway) {
            $("#overlay").hide();
            $("#searchresultdisplay").empty();
            var searchresultdiv = document.getElementById("searchresultdisplay")
            var img = document.createElement("img")
            img.setAttribute("src", "img/notfound.png");
            //img.setAttribute("width", "70");
            // img.setAttribute("height", "70");
            img.setAttribute("alt", "remove");
            img.setAttribute("class", "notfound")
            img.setAttribute("id", "notfound")
            searchresultdiv.appendChild(img)
            var stored = JSON.parse(localStorage.getItem("alldata") || "null")
            console.log(sortway)

            if (sortway) {
                $.ajax({
                    url: `https://collegedataserver.herokuapp.com/getData?sort=${sortway}`,
                    success: function (result) {
                        self.subLoadCard(result)
                        self.LoadStatsModal(".collegename");
                    },
                    error: function (xhr, status, error) {
                        $("#overlay").hide();
                        var errorMessage = xhr.status + ': ' + xhr.statusText
                        alert('Error - ' + errorMessage);
                    }
                }).done(function () {
                    setTimeout(function () {
                        $("#overlay").fadeOut(300);
                    }, 500);
                });
            } else {
                if (!stored) {
                    $.ajax({
                        url: 'https://collegedataserver.herokuapp.com/getData',
                        success: function (result) {
                            localStorage.setItem("alldata", JSON.stringify(result))
                            self.subLoadCard(result)
                            self.LoadStatsModal(".collegename");

                        },
                        error: function (xhr, status, error) {
                            $("#overlay").hide();
                            var errorMessage = xhr.status + ': ' + xhr.statusText
                            alert('Error - ' + errorMessage);
                        }
                    }).done(function () {
                        setTimeout(function () {
                            $("#overlay").fadeOut(300);
                        }, 500);
                    })
                }
                else {
                    console.log("load from local")
                    self.subLoadCard(stored)
                    self.LoadStatsModal(".collegename");

                }

            }

        },

        subLoadCard: function (result) {
            console.log(result)
            var counter = 0;
            for (schoolname in result) {
                if (counter > 10) {
                    break;
                }
                //counter++;
                var container = document.getElementById("searchresultdisplay");
                var div = document.createElement('div');
                var collegename = document.createElement("h4");
                var loc = document.createElement("h6");
                var rate = document.createElement("h6")
                collegename.innerHTML = schoolname;
                loc.innerHTML = result[schoolname]["location"];
                rate.innerHTML = `Acceptance Rate: ${result[schoolname]["acceptance rate"]}%`
                collegename.setAttribute("class", "collegename");
                collegename.setAttribute("id", schoolname)
                loc.setAttribute("class", "location");
                rate.setAttribute("class", "acceptancerate");
                div.setAttribute("id", schoolname)
                div.appendChild(collegename);
                div.appendChild(rate);
                div.appendChild(loc);
                div.setAttribute("class", "collegecard");
                container.appendChild(div);
            }
        },

        LoadStatsModal: function (classname) {
            $(classname).on("click", function () {
                $(this).addClass('underline');
                var stored = JSON.parse(localStorage.getItem("alldata") || "null")
                console.log(classname)
                var $cliked = this
                var schoolname = $(this).parent().attr('id');
                console.log(schoolname)

                if (!stored) {
                    $.ajax({
                        url: "https://collegedataserver.herokuapp.com/getData",
                        success: function (result) {
                            self.subLoadModal(result, schoolname)
                        },
                        error: function (xhr, status, error) {
                            $("#overlay").hide();
                            var errorMessage = xhr.status + ': ' + xhr.statusText
                            alert('Error - ' + errorMessage);
                        }
                    }).done(function () {
                        setTimeout(function () {
                            $("#overlay").fadeOut(300);
                        }, 500);
                    });
                } else {
                    console.log("load from local")
                    //"[id='content Module']"
                    self.subLoadModal(stored, schoolname, `[id='${schoolname}']`)
                }
            });
        },

        subLoadModal: function (result, schoolname, clickedelement) {
            data = result[schoolname]
            console.log(result)
            console.log(clickedelement)
            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];
            $("#modalschoolname").text(data["name"])
            $(".mdacceptancerate").text(`Acceptance Rate: ${data["acceptance rate"]}%`)
            $(".GPA").text(`Middle 50% Admitted GPA(UW): ${data["gpa(uw) 75th percentile"]}-${data["gpa(uw) 25th percentile"]}`)
            $(".SAT").text(`Middle 50% Admitted SAT: ${data["SAT 75th percentile"]}-${data["SAT 25th percenile"]}`)
            $(".ACT").text(`Middle 50% Admitted ACT: ${data["ACT 75th percentile"]}-${data["ACT 25th percentile"]}`)
            if (data["Interview"] == 0) {
                var interview = "No Interview"
            } else {
                var interview = "Interview Required"
            }
            $(".interview").text(interview)
            $(".admitted").text(`Total Admitted: ${data["total admitted"]}`)
            $(".graduationrate").text(`Graduation Rate: ${data["graduation rate"]}`)
            $(".Yield").text(`Yield Rate: ${data["admission yield"]}`)
            $(".avgcost").text(`Average Annual Cost: $${data["average cost of attendance per year"]}`)
            $(".totalundergrad").text(`Total Undergrad Enrollment: ${data["estimated total undergrad enrollment"]}`)
            $(".totalenroll").text(`Total Student Enrollment: ${data["estimated total enrollment"]}`)

            modal.style.display = "block";

            span.onclick = function () {
                modal.style.display = "none";
                console.log($(clickedelement).text())
                $(clickedelement).removeClass('underline');

            }

            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                    $(clickedelement).removeClass('underline');
                }
            }
        },

        rendeBuildView: function () {

            $('.tab-button').removeClass('active');
            $('#build-tab-button').addClass('active');
            var $tab = $('#tab-content');
            $("#overlay").hide();

            $tab.empty();
            $("#tab-content").load("./views/build.html", function () {
                $.mobile.loading().hide();
                $(".setbtn").html("About")
                $("#overlay").hide();
                $(".setbtn").prop('disabled', false);

                $('#costfilter').animate({
                    opacity: 0.6
                }, 50);
                $('#geofilter').animate({
                    opacity: 0.6
                }, 50);
                $('#majorfilter').animate({
                    opacity: 0.6
                }, 50);
                document.getElementById('explore-tab-button').style.pointerEvents = 'auto';
                document.getElementById('build-tab-button').style.pointerEvents = 'auto';
                document.getElementById('list-tab-button').style.pointerEvents = 'auto';
                $("#overlay").hide();

                $(".appname").text("Build My List");
                $(".majorinput").prop('disabled', true);
                $(".maxcost").prop('disabled', true);
                $(".georest").prop('disabled', true);

                $('.ifcost').change(
                    function () {
                        if (this.checked) {
                            $(".maxcost").prop('disabled', false);
                            $('#costfilter').animate({
                                opacity: 1.0
                            }, 500);
                        } else {
                            $(".maxcost").prop('disabled', true);
                            $('#costfilter').animate({
                                opacity: 0.6
                            }, 500);
                        }
                       
                    });
                $('.ifgeo').change(
                    function () {
                        if (this.checked) {
                            $(".georest").prop('disabled', false);
                            $('#geofilter').animate({
                                opacity: 1.0
                            }, 500);
                        } else {
                            $(".georest").prop('disabled', true);
                            $('#geofilter').animate({
                                opacity: 0.6
                            }, 500);
                        }
                    });
                $('.ifmajor').change(
                    function () {
                        if (this.checked) {
                            $(".majorinput").prop('disabled', false);
                            $('#majorfilter').animate({
                                opacity: 1.0
                            }, 500);
                        } else {
                            $(".majorinput").prop('disabled', true);
                            $('majorfilter').animate({
                                opacity: 0.6
                            }, 500);
                        }
                    });
                $(".buildbutton").on('click', function () {
                    self.buildcollegelist();
                })

                $("#overlay").hide();

                var list = JSON.parse(localStorage.getItem("builtlist") || "null")
                var colleges = JSON.parse(localStorage.getItem("alldata") || "null")
                if (colleges && list) {
                    $("#overlay").hide();

                    console.log(colleges)
                    console.log(list)
                    self.loadBuiltList(list, colleges)
                }
            });

        },


        loadBuiltList: function (result, data) {
            $(".builtlist").empty()
            $("#overlay").hide();

            for (type in result) {
                console.log(type)
                if (type == "Reach") {
                    var label = "Reach"
                    var divclass = "reachcard"
                } else if (type == "Match") {
                    var label = "Match"
                    var divclass = "matchcard"
                } else {
                    var label = "Safety"
                    var divclass = "safetycard"
                }
                console.log(result)
                for (i in result[type]) {
                    school = result[type][i]
                    console.log(result[school])
                    console.log(data[school]["acceptance rate"])
                    var container = document.getElementById("builtlist");
                    var div = document.createElement('div');
                    var table = document.createElement('table')
                    var th1 = document.createElement('th')
                    var tr1 = document.createElement('tr')
                    var th2 = document.createElement('th')
                    var tr2 = document.createElement('tr')
                    var addbuttonth = document.createElement('th')
                    var addbutton = document.createElement('button')
                    var th31 = document.createElement('th')
                    var th32 = document.createElement('th')
                    var tr3 = document.createElement('tr')
                    var collegename = document.createElement("h4");
                    var gpa = document.createElement("h6");
                    var SAT = document.createElement("h6");
                    var ACT = document.createElement("h6")
                    var accrate = document.createElement("h6");
                    var schooltype = document.createElement("h3")
                    schooltype.innerHTML = label
                    addbutton.innerHTML = "Add to college list"
                    collegename.innerHTML = `${school} (${label})`;
                    accrate.innerHTML = `Acceptance Rate: ${data[school]["acceptance rate"]}%`
                    gpa.innerHTML = `Middle 50% Admitted GPA(UW): ${data[school]["gpa(uw) 75th percentile"]}-${data[school]["gpa(uw) 25th percentile"]}`
                    SAT.innerHTML = `Middle 50% Admitted SAT: ${data[school]["SAT 75th percentile"]}-${data[school]["SAT 25th percenile"]}`
                    ACT.innerHTML = `Middle 50% Admitted ACT: ${data[school]["ACT 75th percentile"]}-${data[school]["ACT 25th percentile"]}`
                    collegename.setAttribute("class", "buildSchoolName")
                    collegename.setAttribute("id", school)
                    accrate.setAttribute("class", "buildAcc")
                    gpa.setAttribute("class", "buildgpa")
                    SAT.setAttribute("class", "buildSAT")
                    ACT.setAttribute("class", "buildACT")
                    table.setAttribute("class", "buildtable")
                    th1.setAttribute("class", "buildth")
                    tr1.setAttribute("class", "buildtr")
                    th2.setAttribute("class", "buildth")
                    addbuttonth.setAttribute("class", "buildaddbuttonth")
                    addbutton.setAttribute("class", "addbutton")
                    tr2.setAttribute("class", "buildtr")
                    tr3.setAttribute("class", "buildtr")
                    th31.setAttribute("class", "buildth")
                    th32.setAttribute("class", "buildth")
                    div.setAttribute("class", divclass)
                    div.setAttribute("id", school)
                    addbuttonth.appendChild(addbutton)
                    th1.appendChild(accrate)
                    tr1.appendChild(th1)

                    th2.appendChild(gpa)
                    tr2.appendChild(th2)
                    tr1.appendChild(addbuttonth)
                    th31.appendChild(SAT)
                    th32.appendChild(ACT)
                    tr3.appendChild(th31)
                    tr3.appendChild(th32)

                    table.appendChild(tr1)
                    table.appendChild(tr2)
                    table.appendChild(tr3)

                    div.appendChild(collegename)
                    div.appendChild(accrate)
                    div.appendChild(table)

                    container.appendChild(div)

                }

            }
            self.LoadStatsModal(".buildSchoolName")
            $(".addbutton").click(function () {
                var list = JSON.parse(localStorage.getItem("mylist") || "null")
                if (!list) {
                    var list = {}
                    localStorage.setItem("mylist", JSON.stringify(list))
                    console.log("created new ")
                }
                var list = JSON.parse(localStorage.getItem("mylist"))
                type = $(this).parent().parent().parent().parent().attr('class').split("card")[0];
                school = $(this).parent().parent().parent().parent().attr('id');
                if (school in list) { alert(`${school} already in college list!`) }
                else {
                    list[school] = type
                    console.log("added")
                    window.plugins.toast.showLongBottom(`${school} added to college list`)
                }
                localStorage.setItem("mylist", JSON.stringify(list))
                console.log(JSON.parse(localStorage.getItem("mylist")))
            })
        },

        buildcollegelist: function () {
            console.log("build")
            var selectors = [".mygpa", ".mytestscore", ".numberofschool"]
            var querystring = "?"
            var gpa = $(".mygpa").val()
            console.log(gpa)
            querystring += `gpa=${gpa}`
            var testscore = $(".mytestscore").val()
            if (testscore.length == 2) {
                var testtype = 'act'
            }
            else {
                var testtype = 'sat'
            }
            querystring += `&${testtype}=${testscore}`
            var number = $(".numberofschool").val()
            querystring += `&number=${number}`
            var ifcost = $(".ifcost").is(":checked")
            if (ifcost) {
                selectors.push(".maxcost")
                querystring += `&maxcost=${$(".maxcost").val()}`
            }
            var ifgeo = $(".ifgeo").is(":checked")
            if (ifgeo) {
                selectors.push(".georest")
                querystring += `&state=${$(".georest").find(":selected").val()}`
            }
            var ifmajor = $(".ifmajor").is(":checked")
            if (ifmajor) {
                selectors.push(".majorinput")
                querystring += `&major=${$(".majorinput").val()}`
            }
            for (var i = 0; i < selectors.length; i++) {
                var tester = $(selectors[i]).val()

                if (selectors[i] != ".majorinput" && selectors[i] != ".georest") {
                    if (isNaN(parseFloat(tester))) {
                        alert("Invalid Input");
                        return;
                    }
                }
                else {
                    if (tester == "" || tester == null) {
                        alert("Invalid Input");
                        return;
                    }
                }
            }

            $.ajax({
                url: `https://collegedataserver.herokuapp.com/build${querystring}`,
                success: function (result) {
                    $.ajax({
                        url: "https://collegedataserver.herokuapp.com/getData",
                        success: function (data) {
                            localStorage.setItem("builtlist", JSON.stringify(result))
                            self.loadBuiltList(result, data)


                        },
                        error: function (xhr, status, error) {
                            $("#overlay").hide();
                            var errorMessage = xhr.status + ': ' + xhr.statusText
                            alert('Error - ' + errorMessage);
                        }
                    }).done(function () {
                        setTimeout(function () {
                            $("#overlay").fadeOut(300);
                        }, 500);
                    });
                },
                error: function (xhr, status, error) {
                    $("#overlay").hide();
                    alert("Invalid Input");
                }
            })

        },

        renderListView: function () {
            $('.tab-button').removeClass('active');
            $('#list-tab-button').addClass('active');
            var $tab = $('#tab-content');
            $("#overlay").hide();

            $tab.empty();
            $("#tab-content").load("./views/list.html", function () {
                $(".setbtn").html("About")
                $(".setbtn").prop('disabled', false);

                $.mobile.loading().hide();
                document.getElementById('explore-tab-button').style.pointerEvents = 'auto';
                document.getElementById('build-tab-button').style.pointerEvents = 'auto';
                document.getElementById('list-tab-button').style.pointerEvents = 'auto';
                $("#overlay").hide();
                $(".appname").text("My College List");
                self.loadUserCollegeList()
                $(".removebutton").on("click", function () {
                    $(this).attr("src", "img/logo.png")
                    schoolname = $(this).parent().attr('id')
                    console.log(schoolname)
                    var result = confirm(`Delete ${schoolname} from college list?`);
                    if (result) {
                        $(this).attr("src", "img/btn.png")
                        var list = JSON.parse(localStorage.getItem("mylist") || "null")
                        if (!list) {
                            alert("Error occured")
                        } else {
                            $(this).parent().remove()
                            delete list[schoolname]
                            localStorage.setItem("mylist", JSON.stringify(list))
                            console.log(localStorage.getItem("mylist"))
                            var listdiv = document.getElementById("usercollegelist")
                            var noschool = document.createElement("h3")
                            noschool.innerHTML = "You have no colleges under you list. Go to 'Build my List' to add colleges."
                            if (!list || Object.keys(list).length == 0) {
                                listdiv.appendChild(noschool)
                                return;
                            }
                        }

                    }
                    else {
                        $(this).attr("src", "img/btn.png")
                    }
                })
                $("#overlay").hide();

                self.LoadStatsModal(".schoolname");
            });
        },

        loadUserCollegeList: function () {
            var list = JSON.parse(localStorage.getItem("mylist") || "null")
            var listdiv = document.getElementById("usercollegelist")
            var noschool = document.createElement("h3")
            noschool.innerHTML = "You have no colleges under you list. Go to 'Build my List' to add colleges."
            if (!list || Object.keys(list).length == 0) {
                listdiv.appendChild(noschool)
                return;
            }
            for (schoolname in list) {
                type = list[schoolname]
                if (type == "reach") {
                    self.constructEach(schoolname, type)
                }
            }
            for (schoolname in list) {
                type = list[schoolname]
                if (type == "match") {
                    self.constructEach(schoolname, type)
                }
            }
            for (schoolname in list) {
                type = list[schoolname]
                if (type == "safety") {
                    self.constructEach(schoolname, type)
                }
            }

        },

        getData: function () {
            var stored = JSON.parse(localStorage.getItem("alldata") || "null")

            if (!stored) {
                $.ajax({
                    url: 'https://collegedataserver.herokuapp.com/getData',
                    success: function (result) {
                        localStorage.setItem("alldata", JSON.stringify(result))
                        return JSON.parse(localStorage.getItem("alldata"))
                    },
                    error: function (xhr, status, error) {
                        
                        $("#overlay").hide();
                            
                        var errorMessage = xhr.status + ': ' + xhr.statusText
                        alert('Error - ' + errorMessage);
                        return {}
                    }
                }).done(function () {
                    setTimeout(function () {
                        $("#overlay").fadeOut(300);
                    }, 500);
                });
            } else {
                console.log("load from local")
                return stored
            }
        },

        constructEach: function (schoolname, schooltype) {
            var data = this.getData()
            var listdiv = document.getElementById("usercollegelist")
            console.log(listdiv)
            var collegecard = document.createElement("div")
            var name = document.createElement("h4")
            var location = document.createElement("p")
            var accrate = document.createElement("h6")
            var removeButton = document.createElement("IMG");
            removeButton.setAttribute("src", "img/btn.png");
            removeButton.setAttribute("width", "30");
            removeButton.setAttribute("height", "30");
            removeButton.setAttribute("alt", "remove");
            removeButton.setAttribute("class", "removebutton")
            name.innerHTML = `${schoolname} (${schooltype})`
            location.innerHTML = data[schoolname]["location"]
            accrate.innerHTML = `Acceptance Rate: ${data[schoolname]["acceptance rate"]}%`
            name.setAttribute("class", "schoolname")
            name.setAttribute("id", schoolname)
            accrate.setAttribute("class", "accrate")
            location.setAttribute("class", "location")
            collegecard.appendChild(name)
            collegecard.appendChild(removeButton)
            collegecard.appendChild(accrate)
            collegecard.appendChild(location)
            collegecard.setAttribute("id", schoolname)
            if (type == "reach") {
                var divclass = "reachcard"
            } else if (type == "match") {
                var divclass = "matchcard"
            } else {
                var divclass = "safetycard"
            }
            collegecard.setAttribute("class", divclass)
            listdiv.appendChild(collegecard)
        }

    }
    controller.initialize();
    return controller;
}
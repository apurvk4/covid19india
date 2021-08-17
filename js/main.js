$(window).bind("beforeunload", function () {
  sessionStorage.clear();
});
function scroll() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function PinSearch(type, cb) {
  var input;
  var val;
  var form;
  if (type == 1) {
    input = document.getElementById("pininput1");
    val = input.value;
    form = document.getElementById("StateToPin1");
  } else if (type == 0) {
    input = document.getElementById("pininput0");
    val = input.value;
    form = document.getElementById("StateToPin0");
  }
  if (!validatePin(val)) {
    form.innerHTML = `<label>Pincode</label>
        <input class="form-control mr-sm-2 bg-white text-black is-invalid" id="pininput${type}" type="pincode" placeholder="Pincode" value="${val}" aria-label="pincode" oninput="PinValid(${type})">
        <div class="invalid-feedback" id="invalid-feedback" style="font-size: medium;!important border:thick">Invalid pinCode! Please enter valid Pincode.</div>
        <button class="btn btn-success my-2 my-sm-0 "  id="PinButton" type="submit">Search</button>`;
    if (PreLoadActive) {
      removePreload();
    }
  } else {
    sessionStorage.setItem("pin", val);
    sessionStorage.removeItem("currentState");
    sessionStorage.removeItem("currentDistrict");
    history.pushState({}, "", `${window.location.pathname}?pin=${val}&y`); //y=dateSearch
    let div = document.getElementById("dateResults");
    results.getData(type, 3, () => {
      plotData(3);
      cb();
    });
    let newtitle = `${val} Available Slots`;
    document.title = newtitle;
    div.innerHTML = "";
    div.innerHTML += `<div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>`;
  }
}
$(window).bind("popstate", function () {
  let params = new URLSearchParams(window.location.search);
  let s_id = params.get("state");
  let d_id = params.get("dist");
  let pin = params.get("pin");
  let date = params.get("date");
  let PinSearch1 = pin ? true : false;
  if (params.has("y")) {
    Button.clearFilters();
    let res = document.getElementById("dateResults");
    if (res) {
      res.innerHTML = "";
      if (!PinSearch1) {
        SwithToDistrict();
        if (typeof districts != "undefined") {
          let flag = false;
          let d_name = districts.GetName(d_id);
          if (d_name) {
            flag = true;
          }
          if (flag) {
            loadStates(1, s_id);
            loadDistricts(1, d_id);
            formSubmit(1, 2, removePreload);
            let newtitle = `${d_name} Available slots`;
            document.title = newtitle;
          } else {
            loadStates(1, s_id);
            loadStates(0);
            let val = false;
            initDistricts(s_id, () => {
              document
                .getElementById(`district1`)
                .setAttribute("disabled", "disabled");
              document
                .getElementById(`DistrictSubmit1`)
                .setAttribute("disabled", "disabled");
              let district = document.getElementById(`district1`);
              district.innerHTML = "";
              val = true;
              loadDistricts(1, s_id);
              loadDistricts(0);
              formSubmit(1, 2, removePreload);
              document.getElementById(`district1`).removeAttribute("disabled");
              document
                .getElementById(`DistrictSubmit1`)
                .removeAttribute("disabled");
            });
            if (!val) {
              document
                .getElementById(`district1`)
                .setAttribute("disabled", "disabled");
              document
                .getElementById(`DistrictSubmit1`)
                .setAttribute("disabled", "disabled");
            }
            d_name = districts.GetName(d_id);
            let newtitle = `${d_name} Available slots`;
            document.title = newtitle;
          }
        } else {
          let val = false;
          initStates(() => {
            document
              .getElementById(`district1`)
              .setAttribute("disabled", "disabled");
            initDistricts(s_id, () => {
              val = true;
              loadDistricts(1, d_id);
              loadDistricts(0);
              formSubmit(1, 2, removePreload);
              document
                .getElementById(`DistrictSubmit1`)
                .removeAttribute("disabled");
              document.getElementById(`district1`).removeAttribute("disabled");
            });
            loadStates(1, s_id);
            loadStates(0);
          });
          if (!val) {
            document
              .getElementById(`DistrictSubmit1`)
              .setAttribute("disabled", "disabled");
          }
          let d_name = districts.GetName(d_id);
          if (!d_name) {
            let newtitle = `${d_name} Available slots`;
            document.title = newtitle;
          }
        }
      } else {
        SwithToPin();
        let input = document.getElementById("pininput1");
        if (input) {
          input.value = pin;
          PinSearch(1, removePreload);
        } else {
          removePreload();
        }
      }
    } else {
      $('[data-toggle="popover"]').popover("hide");
      $("#ad").popover("dispose");
      let d = document.getElementById("MainContent");
      d.innerHTML = "";
      d.innerHTML = `<div class="container h-100" id="start">
                    <div class=" d-flex justify-content-center align-items-center">
                                <a href="javascript:" >
                                <button class="btn Button-clicked" id="flexDistrict" onclick="SwithToDistrict()">District</button>
                                </a>
                                <a href="javascript:" >
                                <button class="btn btn-secondary" id="flexPincode" onclick="SwithToPin()">Pincode</button>
                                </a>
                    </div>
                    <div class="d-flex h-100 justify-content-center align-items-center" id="BeforeStateToPin">
                        <form class="form-group " id="StateToPin1">
                            <div class="form-group " id="0statechange">
                            <label for="state">State</label>
                            <select class="form-control" id="state1" onchange="stateSelected(this.value,1)">
                            </select>
                            </div>
                            <div class="form-group" id="mydiv1">
                            <label for="District">District</label>
                            <select class="form-control" id="district1">
                            </select>
                            </div>
                            <div class="form-group col-sm-4">
                            <button class="btn btn-success my-2 my-sm-0" type="submit" id="DistrictSubmit1" >Search</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="container h-100">
                    <div class="d-flex h-100 align-items-center justify-content-center">
                        <div class="font-weight-bold">Filters</div>
                    </div>
                </div>
                ${addFilterButtons()}
                </br>
                <div id="res">
                <div id="dateResults" class="container h-100">
                </div>
                </div>`;
      if (!PinSearch1) {
        loadStates(1, s_id);
        loadDistricts(1, d_id);
        formSubmit(1, 2, removePreload);
      } else {
        SwithToPin();
        let input = document.getElementById("pininput1");
        input.value = pin;
        PinSearch(1, removePreload);
      }
    }
  } else {
    Button.clearFilters();
    if (results.GetCopy()) {
      plotData(4, date);
      removePreload();
    } else {
      if (PinSearch1) {
        results.getData(1, 3, () => {
          plotData(4, date);
          removePreload();
        }); // pin search
      } else {
        results.getData(1, 2, () => {
          plotData(4, date);
          removePreload();
        });
      }
    }
  }
});
$(window).on("load", () => {
  $(document).on(
    "click",
    "#agefilter,#PageNavUl,#vaccinefilter,#feefilter,#dosefilter,#ad,#dateShift,#gobackanchor,#PinButton0,#DistrictSubmit0",
    function () {
      $('[data-toggle="popover"]').popover("hide");
      $("#ad").popover("dispose");
      if (!sessionStorage.getItem("popover")) {
        sessionStorage.setItem("popover", "y");
      }
    }
  );
  $(document).on("click", "#closePopover", function () {
    $('[data-toggle="popover"]').popover("hide");
    $("#ad").popover("dispose");
  });
  $(document).on("click", "#DistrictSubmit1", function (event) {
    event.preventDefault();
    formSubmit(1, 2);
    event.stopPropagation();
  });
  $(document).on("click", "#DistrictSubmit0", function (event) {
    event.preventDefault();
    let params = new URLSearchParams(window.location.search);
    if (params.has("n")) {
      Button.clearFilters();
    }
    formSubmit(0, 2);
    event.stopPropagation();
  });
  $(document).on("click", "#PinButton1", function (event) {
    event.preventDefault();
    PinSearch(1);
    event.stopPropagation();
  });
  $(document).on("click", "#PinButton0", function (event) {
    event.preventDefault();
    let params = new URLSearchParams(window.location.search);
    if (params.has("n")) {
      Button.clearFilters();
    }
    PinSearch(0);
    event.stopPropagation();
  });
  $("#Retry").on("click", () => {});
});
function removePreload() {
  $("#PreLoad").removeClass("d-flex justify-content-center align-items-center");
  $("#PreLoad").css("display", "none");
  $("#mynavbartop,#scroll,#h1,#info,#MainContent").css("display", "");
  $("body").css("overflow", "auto");
  $("#footer").css("display", "block");
  PreLoadActive = false;
  let d = document.getElementById("hospitalResults");
  if (d) {
    d.addEventListener(
      "mouseover",
      (e) => {
        if (e.target.id.includes("Hospital") && e.target.id != "HospitalRes") {
          e.target.click();
          //   document.getElementById("agefilter").click();
        }
      },
      false
    );
  }
  document.getElementById("agefilter").addEventListener("mouseenter", (e) => {
    e.target.click();
  });
  document
    .getElementById("vaccinefilter")
    .addEventListener("mouseenter", (e) => {
      e.target.click();
    });

  document.getElementById("feefilter").addEventListener("mouseenter", (e) => {
    e.target.click();
  });
  document.getElementById("dosefilter").addEventListener("mouseenter", (e) => {
    e.target.click();
  });
}
function addPreLoad() {
  PreLoadActive = true;
  $("#PreLoad").addClass("d-flex justify-content-center align-items-center ");
  $("#PreLoad").css("display", "block");
  $("#mynavbartop,#scroll,#h1,#info,#MainContent,#footer").css(
    "display",
    "none"
  );
  $("body").css("overflow", "hidden");
}
// array[0:{state_id: number,state_name: string}, ...];
function StoreStates(data) {
  let m = new Map();
  let m1 = new Map();
  for (let i = 0; i < data.length; i++) {
    m.set(data[i]["state_id"], data[i]["state_name"].trim());
    m1.set(data[i]["state_name"].trim(), data[i]["state_id"]);
  }
  return {
    GetName: function (id) {
      return m.get(Number(id));
    },
    GetId: function (name) {
      return m1.get(name);
    },
    All: function () {
      return data;
    },
  };
}
function StoreDistricts(data, s_id) {
  let m = new Map();
  let m1 = new Map();
  for (let i = 0; i < data.length; i++) {
    m.set(data[i]["district_id"], data[i]["district_name"].trim());
    m1.set(data[i]["district_name"].trim(), data[i]["district_id"]);
  }
  return {
    state_id: s_id,
    state_name: states.GetName(s_id),
    GetName: function (id) {
      return m.get(Number(id));
    },
    GetId: function (name) {
      return m1.get(name.trim());
    },
    All: function () {
      return data;
    },
  };
}
var states;
//array[0:{district_id: number,district_name: string}, ...];
var districts;
function querySearch() {
  let params = new URLSearchParams(window.location.search);
  let d_id = params.get("dist");
  let s_id = params.get("state");
  let pin = params.get("pin");
  if (params.has("dist")) {
    if (params.has("y")) {
      if (typeof districts != "undefined") {
        let flag = false;
        let d_name = districts.GetName(d_id);
        if (d_name) {
          flag = true;
        }
        if (flag) {
          loadStates(1, s_id);
          loadDistricts(1, d_id);
          formSubmit(1, 2, removePreload);
          let newtitle = `${d_name} Available slots`;
          document.title = newtitle;
        } else {
          loadStates(1, s_id);
          loadStates(0);
          let val = false;
          initDistricts(s_id, () => {
            district.setAttribute("disabled", "disabled");
            document
              .getElementById(`DistrictSubmit1`)
              .setAttribute("disabled", "disabled");
            district.innerHTML = "";
            loadDistricts(1, s_id);
            val = true;
            loadDistricts(0);
            formSubmit(1, 2, removePreload);
            district.removeAttribute("disabled");
            document
              .getElementById(`DistrictSubmit1`)
              .removeAttribute("disabled");
            d_name = districts.GetName(d_id);
            let newtitle = `${d_name} Available slots`;
            document.title = newtitle;
          });
          if (!val) {
            district.setAttribute("disabled", "disabled");
            document
              .getElementById(`DistrictSubmit1`)
              .setAttribute("disabled", "disabled");
          }
        }
      } else {
        let val = false;
        initStates(() => {
          document
            .getElementById(`district1`)
            .setAttribute("disabled", "disabled");
          initDistricts(s_id, () => {
            val = true;
            loadDistricts(1, d_id);
            loadDistricts(0);
            formSubmit(1, 2, removePreload);
            document
              .getElementById(`DistrictSubmit1`)
              .removeAttribute("disabled");
            document.getElementById(`district1`).removeAttribute("disabled");
            let d_name = districts.GetName(d_id);
            let newtitle = `${d_name} Available slots`;
            document.title = newtitle;
          });
          loadStates(1, s_id);
          loadStates(0);
        });
        if (!val) {
          document
            .getElementById(`DistrictSubmit1`)
            .setAttribute("disabled", "disabled");
        }
      }
    } else if (params.has("n")) {
      let date = params.get("date");
      initStates(() => {
        initDistricts(s_id, () => {
          results.getData(
            1,
            2,
            () => {
              plotData(4, date);
              removePreload();
            },
            true,
            d_id
          );
          loadDistricts(0, d_id);
          let d_name = districts.GetName(d_id);
          newtitle = `Vaccination Centers in ${d_name} on ${date}`;
          document.title = newtitle;
        });
        loadStates(0, s_id);
      });
    }
  } else if (params.has("pin")) {
    if (params.has("y")) {
      SwithToPin();
      let pin = params.get("pin");
      let input = document.getElementById("pininput1");
      input.value = pin;
      PinSearch(1, removePreload);
    } else if (params.has("n")) {
      let date = params.get("date");
      initStates(() => {
        initDistricts(1, () => {
          results.getData(
            1,
            3,
            () => {
              plotData(4, date);
              removePreload();
            },
            true,
            pin
          );
          loadDistricts(0, d_id);
        });
        loadStates(0, s_id);
      });
      newtitle = `Vaccination Centers in ${pin} on ${date}`;
      document.title = newtitle;
    }
  }
}
var PreLoadActive = false;
window.addEventListener("DOMContentLoaded", function () {
  addPreLoad();
});
window.addEventListener("pageshow", (event) => {
  if (window.location.search) {
    querySearch();
  } else {
    let val = false;
    initStates(() => {
      document.getElementById(`district1`).setAttribute("disabled", "disabled");
      initDistricts(1, () => {
        loadDistricts();
        val = true;
        document.getElementById(`DistrictSubmit1`).removeAttribute("disabled");
        document.getElementById(`district1`).removeAttribute("disabled");
        removePreload();
      });
      loadStates();
    });
    if (!val) {
      document
        .getElementById(`DistrictSubmit1`)
        .setAttribute("disabled", "disabled");
    }
  }
});
function SwithToPin() {
  if (document.getElementById("0statechange")) {
    // not do anything when it is already on pin input.
    var btn = document.getElementById("flexPincode");
    btn.setAttribute("class", "btn Button-clicked");
    btn = document.getElementById("flexDistrict");
    btn.setAttribute("class", "btn btn-secondary");
    var form = document.getElementById("StateToPin1");
    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }
    form.innerHTML = `
        <label>Pincode</label>
        <input class="form-control mr-sm-2 bg-white text-black" id="pininput1" type="pincode" placeholder="Pincode" aria-label="pincode" oninput="PinValid(1)"></br>
        <button class="btn btn-success my-2 my-sm-0" type="submit" id="PinButton1">Search</button>`;
    let div = document.getElementById("dateResults");
    if (div) {
      div.innerHTML = "";
    }
  }
}
function SwithToDistrict() {
  if (document.getElementById("pininput1")) {
    var btn = document.getElementById("flexPincode");
    btn.setAttribute("class", "btn btn-secondary");
    btn = document.getElementById("flexDistrict");
    btn.setAttribute("class", "btn Button-clicked");
    var form = document.getElementById("StateToPin1");
    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }
    form.innerHTML = `<div class="form-group " id="0statechange">
        <label for="state">State</label>
        <select class="form-control" id="state1" onchange="stateSelected(this.value,1)">
        </select>
        </div>
        <div class="form-group" id="mydiv1">
        <label for="District">District</label>
        <select class="form-control" id="district1">
        </select>
        </div>
        <div class="form-group col-sm-4">
        <button class="btn btn-success my-2 my-sm-0" type="submit" id="DistrictSubmit1" >Search</button>
        </div>`;
    if (typeof states != "undefined" && typeof districts != "undefined") {
      loadStates(1, sessionStorage.getItem("currentState"));
      loadDistricts(1);
    } else if (
      typeof states == "undefined" &&
      typeof districts == "undefined"
    ) {
      let val = false;
      initStates(() => {
        document
          .getElementById(`district1`)
          .setAttribute("disabled", "disabled");
        initDistricts(1, () => {
          loadDistricts();
          val = true;
          document
            .getElementById(`DistrictSubmit1`)
            .removeAttribute("disabled");
          document.getElementById(`district1`).removeAttribute("disabled");
        });
        loadStates();
      });
      if (!val) {
        document
          .getElementById(`DistrictSubmit1`)
          .setAttribute("disabled", "disabled");
      }
    }
    let div = document.getElementById("dateResults");
    if (div) {
      div.innerHTML = "";
    }
  }
}
function stateSelected(val, type) {
  val = states.GetId(val);
  let district = document.getElementById(`district${type}`);
  initDistricts(val, () => {
    district.setAttribute("disabled", "disabled");
    document
      .getElementById(`DistrictSubmit${type}`)
      .setAttribute("disabled", "disabled");
    district.innerHTML = "";
    loadDistricts(type, val);
    district.removeAttribute("disabled");
    document
      .getElementById(`DistrictSubmit${type}`)
      .removeAttribute("disabled");
  });
  district.setAttribute("disabled", "disabled");
  document
    .getElementById(`DistrictSubmit${type}`)
    .setAttribute("disabled", "disabled");
  sessionStorage.setItem("currentState", val);
}
async function initDistricts(val, cb) {
  var Url = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/";
  Url = Url + val;
  try {
    const response = await fetch(Url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      response.text().then((res) => {
        res = JSON.parse(res);
        res = res["districts"];
        districts = StoreDistricts(res, val);
        cb();
      });
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    console.log(err);
    let estr = "error : " + err.message;
    alert(estr);
  }
}
async function initStates(cb) {
  const url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      response.text().then((res) => {
        res = JSON.parse(res);
        res = res["states"];
        states = StoreStates(res);
        cb();
      });
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    console.log(err);
    let estr = "error : " + err.message;
    alert(estr);
  }
}
function loadStates(type, val) {
  var d;
  var d1;
  if (typeof type == "undefined") {
    d = document.getElementById("state1");
    d1 = document.getElementById("state0");
  } else if (type == 1) {
    d = document.getElementById("state1");
  } else if (type == 0) {
    d1 = document.getElementById("state0");
  }
  let states = window.states.All();
  for (let i = 0; i < states.length; i++) {
    var option = document.createElement("option");
    var op1 = document.createElement("option");
    op1.innerHTML = states[i]["state_name"];
    option.innerHTML = states[i]["state_name"];
    if (typeof val != "undefined" && val == states[i]["state_id"]) {
      option.setAttribute("selected", "selected");
      op1.setAttribute("selected", "selected");
      sessionStorage.setItem("currentState", val);
    }
    if (typeof type == "undefined") {
      d.appendChild(option);
      d1.appendChild(op1);
    } else if (type == 1) {
      d.appendChild(option);
    } else if (type == 0) {
      d1.appendChild(op1);
    }
  }
}
function loadDistricts(type, val) {
  var d;
  var d1;
  if (typeof type == "undefined") {
    d = document.getElementById("district1");
    d1 = document.getElementById("district0");
  } else if (type == 1) {
    d = document.getElementById("district1");
  } else if (type == 0) {
    d1 = document.getElementById("district0");
  }
  let districts = window.districts.All();
  for (let i = 0; i < districts.length; i++) {
    var option = document.createElement("option");
    var op1 = document.createElement("option");
    option.innerHTML = districts[i]["district_name"];
    op1.innerHTML = districts[i]["district_name"];
    if (typeof val != "undefined" && val == districts[i]["district_id"]) {
      option.setAttribute("selected", "selected");
      op1.setAttribute("selected", "selected");
      sessionStorage.setItem("currentDistrict", val);
    }
    if (typeof type == "undefined") {
      d.appendChild(option);
      d1.appendChild(op1);
    } else if (type == 1) {
      d.appendChild(option);
    } else if (type == 0) {
      d1.appendChild(op1);
    }
  }
}
function alert(text) {
  return `<div class="d-flex align-items-center justify-content-center">
    <div class="alert alert-danger" role="alert" id="NoDataAlert">${text}</div>
    </div>`;
}
function changeData(copy) {
  if (
    copy["date"].length == 0 ||
    (!Button.isClicked("18+") &&
      !Button.isClicked("45+") &&
      !Button.isClicked("covishield") &&
      !Button.isClicked("covaxin") &&
      !Button.isClicked("sputnik v") &&
      !Button.isClicked("free") &&
      !Button.isClicked("paid") &&
      !Button.isClicked("1stDose") &&
      !Button.isClicked("2ndDose"))
  ) {
    return copy;
  }
  if (
    Button.isClicked("covishield") &&
    !Button.isClicked("covaxin") &&
    !Button.isClicked("sputnik v")
  ) {
    for (let i = 0; i < copy["date"].length; i++) {
      if (copy["date"][i].hasOwnProperty("vaccine")) {
        if (copy["date"][i]["vaccine"].hasOwnProperty("COVAXIN")) {
          delete copy["date"][i]["vaccine"]["COVAXIN"];
        }
        if (copy["date"][i]["vaccine"].hasOwnProperty("SPUTNIK V")) {
          delete copy["date"][i]["vaccine"]["SPUTNIK V"];
        }
      }
      if (copy["date"][i].hasOwnProperty("Hospital")) {
        for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
          let l = copy["date"][i]["Hospital"].length - 1;
          if (copy["date"][i]["Hospital"][j]["vaccine"] == "COVAXIN") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          } else if (copy["date"][i]["Hospital"][j]["vaccine"] == "SPUTNIK V") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          }
        }
      }
    }
  } else if (
    !Button.isClicked("covishield") &&
    Button.isClicked("covaxin") &&
    !Button.isClicked("sputnik v")
  ) {
    for (let i = 0; i < copy["date"].length; i++) {
      if (copy["date"][i].hasOwnProperty("vaccine")) {
        if (copy["date"][i]["vaccine"].hasOwnProperty("COVISHIELD")) {
          delete copy["date"][i]["vaccine"]["COVISHIELD"];
        }
        if (copy["date"][i]["vaccine"].hasOwnProperty("SPUTNIK V")) {
          delete copy["date"][i]["vaccine"]["SPUTNIK V"];
        }
      }
      if (copy["date"][i].hasOwnProperty("Hospital")) {
        for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
          let l = copy["date"][i]["Hospital"].length - 1;
          if (copy["date"][i]["Hospital"][j]["vaccine"] == "COVISHIELD") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          } else if (copy["date"][i]["Hospital"][j]["vaccine"] == "SPUTNIK V") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          }
        }
      }
    }
  } else if (
    !Button.isClicked("covishield") &&
    !Button.isClicked("covaxin") &&
    Button.isClicked("sputnik v")
  ) {
    for (let i = 0; i < copy["date"].length; i++) {
      if (copy["date"][i].hasOwnProperty("vaccine")) {
        if (copy["date"][i]["vaccine"].hasOwnProperty("COVISHIELD")) {
          delete copy["date"][i]["vaccine"]["COVISHIELD"];
        }
        if (copy["date"][i]["vaccine"].hasOwnProperty("COVAXIN")) {
          delete copy["date"][i]["vaccine"]["COVAXIN"];
        }
      }
      if (copy["date"][i].hasOwnProperty("Hospital")) {
        for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
          let l = copy["date"][i]["Hospital"].length - 1;
          if (copy["date"][i]["Hospital"][j]["vaccine"] == "COVAXIN") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          } else if (
            copy["date"][i]["Hospital"][j]["vaccine"] == "COVISHIELD"
          ) {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          }
        }
      }
    }
  } else if (
    Button.isClicked("covishield") &&
    Button.isClicked("covaxin") &&
    !Button.isClicked("sputnik v")
  ) {
    for (let i = 0; i < copy["date"].length; i++) {
      if (copy["date"][i].hasOwnProperty("vaccine")) {
        if (copy["date"][i]["vaccine"].hasOwnProperty("SPUTNIK V")) {
          delete copy["date"][i]["vaccine"]["SPUTNIK V"];
        }
      }
      if (copy["date"][i].hasOwnProperty("Hospital")) {
        for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
          let l = copy["date"][i]["Hospital"].length - 1;
          if (copy["date"][i]["Hospital"][j]["vaccine"] == "SPUTNIK V") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          }
        }
      }
    }
  } else if (
    Button.isClicked("covishield") &&
    !Button.isClicked("covaxin") &&
    Button.isClicked("sputnik v")
  ) {
    for (let i = 0; i < copy["date"].length; i++) {
      if (copy["date"][i].hasOwnProperty("vaccine")) {
        if (copy["date"][i]["vaccine"].hasOwnProperty("COVAXIN")) {
          delete copy["date"][i]["vaccine"]["COVAXIN"];
        }
      }
      if (copy["date"][i].hasOwnProperty("Hospital")) {
        for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
          let l = copy["date"][i]["Hospital"].length - 1;
          if (copy["date"][i]["Hospital"][j]["vaccine"] == "COVAXIN") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          }
        }
      }
    }
  } else if (
    !Button.isClicked("covishield") &&
    Button.isClicked("covaxin") &&
    Button.isClicked("sputnik v")
  ) {
    for (let i = 0; i < copy["date"].length; i++) {
      if (copy["date"][i].hasOwnProperty("vaccine")) {
        if (copy["date"][i]["vaccine"].hasOwnProperty("COVISHIELD")) {
          delete copy["date"][i]["vaccine"]["COVISHIELD"];
        }
      }
      if (copy["date"][i].hasOwnProperty("Hospital")) {
        for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
          let l = copy["date"][i]["Hospital"].length - 1;
          if (copy["date"][i]["Hospital"][j]["vaccine"] == "COVISHIELD") {
            copy["date"][i]["total"] -=
              copy["date"][i]["Hospital"][j]["1stdose"] +
              copy["date"][i]["Hospital"][j]["2nddose"];
            copy["date"][i]["Hospital"].splice(j, 1);
            if (j != l) {
              j--;
            }
          }
        }
      }
    }
  }
  if (Button.isClicked("18+") && !Button.isClicked("45+")) {
    for (let j = 0; j < copy["date"].length; j++) {
      let arr = Object.getOwnPropertyNames(copy["date"][j]["vaccine"]);
      for (let i = 0; i < arr.length; i++) {
        if (copy["date"][j]["vaccine"][`${arr[i]}`].hasOwnProperty(45)) {
          delete copy["date"][j]["vaccine"][`${arr[i]}`]["45"];
        }
      }
    }
    for (let i = 0; i < copy["date"].length; i++) {
      for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
        let l = copy["date"][i]["Hospital"].length - 1;
        if (copy["date"][i]["Hospital"][j]["min_age"] == 45) {
          copy["date"][i]["total"] -=
            copy["date"][i]["Hospital"][j]["1stdose"] +
            copy["date"][i]["Hospital"][j]["2nddose"];
          copy["date"][i]["Hospital"].splice(j, 1);
          if (j != l) {
            j--;
          }
        }
      }
    }
  } else if (!Button.isClicked("18+") && Button.isClicked("45+")) {
    for (let j = 0; j < copy["date"].length; j++) {
      let arr = Object.getOwnPropertyNames(copy["date"][j]["vaccine"]);
      for (let i = 0; i < arr.length; i++) {
        if (copy["date"][j]["vaccine"][`${arr[i]}`].hasOwnProperty(18)) {
          delete copy["date"][j]["vaccine"][`${arr[i]}`]["18"];
        }
      }
    }
    for (let i = 0; i < copy["date"].length; i++) {
      for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
        let l = copy["date"][i]["Hospital"].length - 1;
        if (copy["date"][i]["Hospital"][j]["min_age"] == 18) {
          copy["date"][i]["total"] -=
            copy["date"][i]["Hospital"][j]["1stdose"] +
            copy["date"][i]["Hospital"][j]["2nddose"];
          copy["date"][i]["Hospital"].splice(j, 1);
          if (j != l) {
            j--;
          }
        }
      }
    }
  }
  if (Button.isClicked("1stDose") && !Button.isClicked("2ndDose")) {
    for (let i = 0; i < copy["date"].length; i++) {
      let arr = Object.getOwnPropertyNames(copy["date"][i]["vaccine"]);
      for (let j = 0; j < arr.length; j++) {
        let age_value = [18, 45];
        for (let k = 0; k < age_value.length; k++) {
          if (
            copy["date"][i]["vaccine"][`${arr[j]}`].hasOwnProperty(
              `${age_value[k]}`
            )
          ) {
            if (
              copy["date"][i]["vaccine"][`${arr[j]}`][
                `${age_value[k]}`
              ].hasOwnProperty("2nddose")
            ) {
              delete copy["date"][i]["vaccine"][`${arr[j]}`][`${age_value[k]}`][
                "2nddose"
              ];
            }
          }
        }
      }
    }
    for (let i = 0; i < copy["date"].length; i++) {
      for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
        let l = copy["date"][i]["Hospital"].length - 1;
        copy["date"][i]["total"] -= copy["date"][i]["Hospital"][j]["2nddose"];
        if (copy["date"][i]["Hospital"][j]["1stdose"] == 0) {
          copy["date"][i]["Hospital"].splice(j, 1);
          if (j != l) {
            j--;
          }
        }
      }
    }
  } else if (!Button.isClicked("1stDose") && Button.isClicked("2ndDose")) {
    for (let i = 0; i < copy["date"].length; i++) {
      let arr = Object.getOwnPropertyNames(copy["date"][i]["vaccine"]);
      for (let j = 0; j < arr.length; j++) {
        let age_value = [18, 45];
        for (let k = 0; k < age_value.length; k++) {
          if (
            copy["date"][i]["vaccine"][`${arr[j]}`].hasOwnProperty(
              `${age_value[k]}`
            )
          ) {
            if (
              copy["date"][i]["vaccine"][`${arr[j]}`][
                `${age_value[k]}`
              ].hasOwnProperty("1stdose")
            ) {
              delete copy["date"][i]["vaccine"][`${arr[j]}`][`${age_value[k]}`][
                "1stdose"
              ];
            }
          }
        }
      }
    }
    for (let i = 0; i < copy["date"].length; i++) {
      for (let j = 0; j < copy["date"][i]["Hospital"].length; j++) {
        let l = copy["date"][i]["Hospital"].length - 1;
        copy["date"][i]["total"] -= copy["date"][i]["Hospital"][j]["1stdose"];
        if (copy["date"][i]["Hospital"][j]["2nddose"] == 0) {
          copy["date"][i]["Hospital"].splice(j, 1);
          if (j != l) {
            j--;
          }
        }
      }
    }
  }
  if (Button.isClicked("free") && !Button.isClicked("paid")) {
    for (let i = 0; i < copy["date"].length; i++) {
      let vaccine_names = Object.getOwnPropertyNames(
        copy["date"][i]["vaccine"]
      );
      for (let j = 0; j < vaccine_names.length; j++) {
        let age_list = Object.getOwnPropertyNames(
          copy["date"][i]["vaccine"][`${vaccine_names[j]}`]
        );
        for (let k = 0; k < age_list.length; k++) {
          let dose_list = Object.getOwnPropertyNames(
            copy["date"][i]["vaccine"][`${vaccine_names[j]}`][`${age_list[k]}`]
          );
          for (let l = 0; l < dose_list.length; l++) {
            if (
              copy["date"][i]["vaccine"][`${vaccine_names[j]}`][
                `${age_list[k]}`
              ][`${dose_list[l]}`].hasOwnProperty("paid")
            ) {
              delete copy["date"][i]["vaccine"][`${vaccine_names[j]}`][
                `${age_list[k]}`
              ][`${dose_list[l]}`]["paid"];
            }
          }
        }
      }
      for (let m = 0; m < copy["date"][i]["Hospital"].length; m++) {
        let n = copy["date"][i]["Hospital"].length - 1;
        if (copy["date"][i]["Hospital"][m]["fee_type"] == "Paid") {
          copy["date"][i]["total"] -=
            copy["date"][i]["Hospital"][m]["1stdose"] +
            copy["date"][i]["Hospital"][m]["2nddose"];
          copy["date"][i]["Hospital"].splice(m, 1);
          if (m != n) {
            m--;
          }
        }
      }
    }
  } else if (!Button.isClicked("free") && Button.isClicked("paid")) {
    for (let i = 0; i < copy["date"].length; i++) {
      let vaccine_names = Object.getOwnPropertyNames(
        copy["date"][i]["vaccine"]
      );
      for (let j = 0; j < vaccine_names.length; j++) {
        let age_list = Object.getOwnPropertyNames(
          copy["date"][i]["vaccine"][`${vaccine_names[j]}`]
        );
        for (let k = 0; k < age_list.length; k++) {
          let dose_list = Object.getOwnPropertyNames(
            copy["date"][i]["vaccine"][`${vaccine_names[j]}`][`${age_list[k]}`]
          );
          for (let l = 0; l < dose_list.length; l++) {
            if (
              copy["date"][i]["vaccine"][`${vaccine_names[j]}`][
                `${age_list[k]}`
              ][`${dose_list[l]}`].hasOwnProperty("free")
            ) {
              delete copy["date"][i]["vaccine"][`${vaccine_names[j]}`][
                `${age_list[k]}`
              ][`${dose_list[l]}`]["free"];
            }
          }
        }
      }
      for (let m = 0; m < copy["date"][i]["Hospital"].length; m++) {
        let n = copy["date"][i]["Hospital"].length - 1;
        if (copy["date"][i]["Hospital"][m]["fee_type"] == "Free") {
          copy["date"][i]["total"] -=
            copy["date"][i]["Hospital"][m]["1stdose"] +
            copy["date"][i]["Hospital"][m]["2nddose"];
          copy["date"][i]["Hospital"].splice(m, 1);
          if (m != n) {
            m--;
          }
        }
      }
    }
  }
  return copy;
}
var results = (function () {
  let actualData = null;
  let gotresult = false;
  let currentFilteredData = null;
  return {
    gotresponse: function () {
      return gotresult;
    },
    getData: function (type, type1, cb, flag, d) {
      let url = 0;
      var today = new Date();
      var date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      if (type1 == 2) {
        // by district
        let district_name = document.getElementById(`district${type}`).value;
        let district_id = 0;
        if (typeof flag == "undefined") {
          district_id = districts.GetId(district_name);
        } else if (typeof flag != "undefined" && flag) {
          district_id = d;
        }
        url =
          "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=";
        url += district_id + "&date=";
        url = url + date;
        gotresult = false;
      } else if (type1 == 3) {
        // by pincode
        let pincode = null;
        if (typeof flag != "undefined" && flag) {
          pincode = d;
        } else if (typeof flag == "undefined") {
          pincode = document.getElementById(`pininput${type}`).value;
        }
        url =
          "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=";
        url += pincode + "&date=";
        url += date;
        gotresult = false;
      } else {
        return;
      }
      let div = document.getElementById("dateResults");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        results.gotresult = false;
        controller.abort();
        if (PreLoadActive) {
          removePreload();
        }
        div.innerHTML = "";
        div.innerHTML += `<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content ">
                        <div class="modal-header">
                          <h5 class="modal-title" id="staticBackdropLabel">Error</h5>
                        </div>
                        <div class="modal-body">
                         Could not retrieve data.
                         please try again.
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary" data-dismiss="modal" id="Retry" onclick="results.getData(${type},${type1},${cb},${flag},${d})">Try Again</button>
                        </div>
                      </div>
                    </div>
                  </div>`;
        $("#staticBackdrop").modal("show");
        div.innerHTML += `<div class="d-flex justify-content-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>`;
      }, 10000);
      fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            clearTimeout(timeoutId);
            results.gotresult = true;
            return response.text();
          } else {
            throw new Error(response.status);
          }
        })
        .then((res) => {
          res = JSON.parse(res);
          res = res["centers"];
          res = ConvertData(res);
          actualData = res;
        })
        .then(() => {
          cb(JSON.parse(JSON.stringify(actualData)));
        })
        .catch((err) => {
          let estr = "error : " + err.message;
          console.log(estr);
        });
    },
    filterData: function () {
      let copy = JSON.parse(JSON.stringify(actualData));
      currentFilteredData = changeData(copy);
      return currentFilteredData;
    },
    GetCopy: function () {
      return JSON.parse(JSON.stringify(actualData));
    },
    getCurrentFilteredData: function () {
      if (!currentFilteredData) {
        this.filterData();
      }
      return currentFilteredData;
    },
  };
})();
var Button = (function () {
  let covishield = false;
  let covaxin = false;
  let sputnik = false;
  let firstDose = false;
  let secondDose = false;
  let eighteen = false;
  let fourtyfive = false;
  let free = false;
  let paid = false;
  return {
    click: (name) => {
      let wrong = false;
      if (name == "covishield") {
        covishield = covishield ? false : true;
        covaxin = false;
        sputnik = false;
      } else if (name == "covaxin") {
        covaxin = covaxin ? false : true;
        covishield = false;
        sputnik = false;
      } else if (name == "sputnik v") {
        sputnik = sputnik ? false : true;
        covishield = false;
        covaxin = false;
      } else if (name == "1stDose") {
        firstDose = firstDose ? false : true;
        secondDose = false;
      } else if (name == "2ndDose") {
        secondDose = secondDose ? false : true;
        firstDose = false;
      } else if (name == "free") {
        free = free ? false : true;
        paid = false;
      } else if (name == "paid") {
        paid = paid ? false : true;
        free = false;
      } else if (name == "18+") {
        eighteen = eighteen ? false : true;
        fourtyfive = false;
      } else if (name == "45+") {
        fourtyfive = fourtyfive ? false : true;
        eighteen = false;
      }
      if (name == "covishield" || name == "covaxin" || name == "sputnik v") {
        for (let i = 1; i < 4; i++) {
          let btn = document.getElementById(`vaccinefilter${i}`);
          let val1 = document.getElementById(`vaccinefilter`).innerHTML;
          let val = btn.innerHTML;
          if (name == val.toLowerCase()) {
            $("#vaccinefilter").text(val);
            if ($("#vaccinefilter").hasClass("btn-secondary")) {
              $("#vaccinefilter").removeClass("btn-secondary");
              $("#vaccinefilter").addClass("Button-clicked");
            } else if ($("#vaccinefilter").hasClass("Button-clicked")) {
              if (val1 == val) {
                $("#vaccinefilter").removeClass("Button-clicked");
                $("#vaccinefilter").addClass("btn-secondary");
              }
            }
            break;
          }
        }
      } else if (name == "18+" || name == "45+") {
        for (let i = 1; i < 3; i++) {
          let btn = document.getElementById(`agefilter${i}`);
          let val = btn.innerHTML;
          let val1 = document.getElementById("agefilter").innerHTML;
          if (name == val) {
            $("#agefilter").text(val);
            if ($("#agefilter").hasClass("btn-secondary")) {
              $("#agefilter").removeClass("btn-secondary");
              $("#agefilter").addClass("Button-clicked");
            } else if ($("#agefilter").hasClass("Button-clicked")) {
              if (val == val1) {
                $("#agefilter").removeClass("Button-clicked");
                $("#agefilter").addClass("btn-secondary");
              }
            }
            break;
          }
        }
      } else if (name == "free" || name == "paid") {
        for (let i = 1; i < 3; i++) {
          let btn = document.getElementById(`feefilter${i}`);
          let val = btn.innerHTML;
          let val1 = document.getElementById("feefilter").innerHTML;
          if (name == val) {
            $("#feefilter").text(val);
            if ($("#feefilter").hasClass("btn-secondary")) {
              $("#feefilter").removeClass("btn-secondary");
              $("#feefilter").addClass("Button-clicked");
            } else if ($("#feefilter").hasClass("Button-clicked")) {
              if (val == val1) {
                $("#feefilter").removeClass("Button-clicked");
                $("#feefilter").addClass("btn-secondary");
              }
            }
            break;
          }
        }
      } else if (name == "1stDose" || name == "2ndDose") {
        for (let i = 1; i < 3; i++) {
          let btn = document.getElementById(`dosefilter${i}`);
          let val = btn.innerHTML;
          let val1 = document.getElementById("dosefilter").innerHTML;
          if (name == val) {
            $("#dosefilter").text(val);
            if ($("#dosefilter").hasClass("btn-secondary")) {
              $("#dosefilter").removeClass("btn-secondary");
              $("#dosefilter").addClass("Button-clicked");
            } else if ($("#dosefilter").hasClass("Button-clicked")) {
              if (val == val1) {
                $("#dosefilter").removeClass("Button-clicked");
                $("#dosefilter").addClass("btn-secondary");
              }
            }
            break;
          }
        }
      } else {
        wrong = true;
      }
      if (!wrong) {
        let params = new URLSearchParams(window.location.search);
        if (params.has("y")) {
          plotData(3);
        } else if (params.has("n")) {
          if (params.has("date")) {
            let date = params.get("date");
            showData.clear();
            plotData(4, date);
          }
        }
      }
    },
    isClicked: (name) => {
      if (name == "covishield") {
        return covishield;
      } else if (name == "covaxin") {
        return covaxin;
      } else if (name == "sputnik v") {
        return sputnik;
      } else if (name == "18+") {
        return eighteen;
      } else if (name == "45+") {
        return fourtyfive;
      } else if (name == "1stDose") {
        return firstDose;
      } else if (name == "2ndDose") {
        return secondDose;
      } else if (name == "free") {
        return free;
      } else if (name == "paid") {
        return paid;
      }
    },
    filterList: () => {
      return [
        "covishield",
        "covaxin",
        "sputnik v",
        "1stDose",
        "2ndDose",
        "18+",
        "45+",
        "free",
        "paid",
      ];
    },
    clearFilters: () => {
      covishield = false;
      covaxin = false;
      sputnik = false;
      firstDose = false;
      secondDose = false;
      eighteen = false;
      fourtyfive = false;
      free = false;
      paid = false;
    },
  };
})();

function Nextdate() {
  let date = document.getElementById("currentdate").innerHTML;
  if (date) {
    let usefulData = results.GetCopy();
    let params = new URLSearchParams(window.location.search);
    let d_id = params.get("dist");
    let s_id = params.get("state");
    let pin = params.get("pin");
    let index = 0;
    for (let i = 0; i < usefulData["date"].length; i++) {
      if (usefulData["date"][i]["value"] == date) {
        index = i;
        break;
      }
    }
    if (index >= 0 && index < usefulData["date"].length - 1) {
      if (pin) {
        history.pushState(
          {},
          "",
          `${window.location.pathname}?pin=${pin}&n&date=${
            usefulData["date"][index + 1]["value"]
          }`
        ); // n= hospitalResults
        document.title = `Vaccination Centers in ${pin} on ${
          usefulData["date"][index + 1]["value"]
        }`;
      } else if (d_id && s_id) {
        history.pushState(
          {},
          "",
          `${window.location.pathname}?dist=${d_id}&state=${s_id}&n&date=${
            usefulData["date"][index + 1]["value"]
          }`
        ); // n= hospitalResults
        document.title = `Vaccination Centers in ${districts.GetName(
          d_id
        )} on ${usefulData["date"][index + 1]["value"]}`;
      }
      let img = document.getElementById("dateshiftleft");
      if (img) {
        img.setAttribute("src", "img/arrow-left.svg");
        document
          .getElementById("previousdateanchor")
          .setAttribute("class", "btn active");
      }
      plotData(4, usefulData["date"][index + 1]["value"]);
    } else {
      let img = document.getElementById("dateshiftright");
      if (img) {
        img.setAttribute("src", "img/arrow-right-fill.svg");
        document
          .getElementById("nextdateanchor")
          .setAttribute("class", "btn disabled");
      }
    }
  }
}
function Previousdate() {
  let date = document.getElementById("currentdate").innerHTML;
  if (date) {
    let usefulData = results.GetCopy();
    let params = new URLSearchParams(window.location.search);
    let d_id = params.get("dist");
    let s_id = params.get("state");
    let pin = params.get("pin");
    let index = 0;
    for (let i = 0; i < usefulData["date"].length; i++) {
      if (usefulData["date"][i]["value"] == date) {
        index = i;
        break;
      }
    }
    if (index > 0) {
      let img = document.getElementById("dateshiftright");
      if (img) {
        img.setAttribute("src", "img/arrow-right.svg");
        document
          .getElementById("nextdateanchor")
          .setAttribute("class", "btn active");
      }
      if (pin) {
        history.pushState(
          {},
          "",
          `${window.location.pathname}?pin=${pin}&n&date=${
            usefulData["date"][index - 1]["value"]
          }`
        ); // n= hospitalResults
        document.title = `Vaccination Centers in ${pin} on ${
          usefulData["date"][index - 1]["value"]
        }`;
      } else if (d_id && s_id) {
        history.pushState(
          {},
          "",
          `${window.location.pathname}?dist=${d_id}&state=${s_id}&n&date=${
            usefulData["date"][index - 1]["value"]
          }`
        ); // n= hospitalResults
        document.title = `Vaccination Centers in ${districts.GetName(
          d_id
        )} on ${usefulData["date"][index - 1]["value"]}`;
      }
      plotData(4, usefulData["date"][index - 1]["value"]);
    } else {
      let img = document.getElementById("dateshiftleft");
      if (img) {
        img.setAttribute("src", "img/arrow-left-fill.svg");
        document
          .getElementById("previousdateanchor")
          .setAttribute("class", " btn disabled");
      }
    }
  }
}
function rel() {
  let url = window.location.protocol + "//";
  url += window.location.host + window.location.pathname;
  let a = document.getElementById("Reload");
  if (a) {
    a.setAttribute("href", url);
    a.click();
  }
}
function formSubmit(type, type1, cb) {
  if (type1 == 2) {
    //district search
    sessionStorage.removeItem("pin");
    let div1 = document.getElementById(`district${type}`);
    let value = div1.value;
    let newtitle = `${value} Available Slots`;
    document.title = newtitle;
    let index = 0;
    value = districts.GetId(value);
    if (!value) {
      value = districts.All()[0]["district_id"];
    }
    if (!sessionStorage.getItem("currentState")) {
      sessionStorage.setItem("currentState", districts.state_id);
    }
    sessionStorage.setItem("currentDistrict", value);
    history.pushState(
      {},
      "",
      `${window.location.pathname}?dist=${value}&state=${sessionStorage.getItem(
        "currentState"
      )}&y`
    ); // y= dateserach
  }
  let div = document.getElementById("dateResults");
  results.getData(type, type1, () => {
    plotData(3);
    cb();
  });
  if (type == 0) {
    let mainContent = document.getElementById("mainContent");
    let res = document.getElementById("dateResults");
    if (!res) {
      mainContent.innerHTML = "";
      mainContent.innerHTML = `<div class="container h-100" id="start">
                <div class=" d-flex justify-content-center align-items-center">
                            <a href="#" >
                            <button class="btn Button-clicked" id="flexDistrict" onclick="SwithToDistrict()">District</button>
                            </a>
                            <a href="#" >
                                <button class="btn btn-secondary" id="flexPincode" onclick="SwithToPin()">Pincode</button>
                            </a>
                </div>
                <div class="d-flex h-100 justify-content-center align-items-center" id="BeforeStateToPin">
                    <form class="form-group " id="StateToPin1">
                        <div class="form-group " id="0statechange">
                        <label for="state">State</label>
                        <select class="form-control" id="state1" onchange="stateSelected(this.value,1)">
                        </select>
                        </div>
                        <div class="form-group" id="mydiv1">
                        <label for="District">District</label>
                        <select class="form-control" id="district1">
                        </select>
                        </div>
                        <div class="form-group col-sm-4">
                        <button class="btn btn-success my-2 my-sm-0" type="submit" id="DistrictSubmit1">Search</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="container h-100">
                <div class="d-flex h-100 align-items-center justify-content-center">
                    <div class="font-weight-bold">Filters</div>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-center" id="filters">
                <div class="btn-group">
                    <button type="button" id="agefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    18+
                    </button>
                    <div class="dropdown-menu">
                    <a class="dropdown-item" id="agefilter1" href="javascript:Button.click('18+')">18+</a>
                    <a class="dropdown-item" id="agefilter2" href="javascript:Button.click('45+')">45+</a>
                    </div>
                </div>
                <div class="btn-group">
                    <button type="button" id="vaccinefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    COVISHIELD
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" id="vaccinefilter1" href="javascript:Button.click('covishield')">COVISHIELD</a>
                    <a class="dropdown-item" id="vaccinefilter2"   href="javascript:Button.click('covaxin')">COVAXIN</a>
                    <a class="dropdown-item" id="vaccinefilter3"   href="javascript:Button.click('sputnik')">SPUTNIK</a>
                    </div>
                </div>
                <div class="btn-group">
                    <button type="button" id="feefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    free
                    </button>
                    <div class="dropdown-menu">
                    <a class="dropdown-item" id="feefilter1" href="javascript:Button.click('free')" >free</a>
                    <a class="dropdown-item" id="feefilter2" href="javascript:Button.click('paid')" >paid</a>
                    </div>
                </div>
                <div class="btn-group">
                    <button type="button" id="dosefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    1stDose
                    </button>
                    <div class="dropdown-menu">
                    <a class="dropdown-item" id="dosefilter1" href="javascript:Button.click('1stDose')">1stDose</a>
                    <a class="dropdown-item" id="dosefilter2" href="javascript:Button.click('2ndDose')">2ndDose</a>
                    </div>
                </div>
            </div>
            </br>
            <div id="res">
            <div id="dateResults" class="container h-100">
            </div>
            </div>`;
    }
    SwithToDistrict();
    loadStates(1, sessionStorage.getItem("currentState"));
    loadDistricts(1, sessionStorage.getItem("currentDistrict"));
  }
  if (div) {
    div.innerHTML = "";
    div.innerHTML += `<div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>`;
  } else {
    div = document.getElementById("res");
    if (div) {
      div.innerHTML = "";
      div.innerHTML += `<div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>`;
    }
  }
}
function SwitchToHospital(date) {
  let params = new URLSearchParams(window.location.search);
  let d_id = params.get("dist");
  let s_id = params.get("state");
  let pin = params.get("pin");
  if (pin) {
    history.pushState(
      {},
      "",
      `${window.location.pathname}?pin=${pin}&n&date=${date}`
    ); // n= hospitalResults
  } else if (d_id && s_id) {
    history.pushState(
      {},
      "",
      `${window.location.pathname}?dist=${d_id}&state=${s_id}&n&date=${date}`
    ); // n= hospitalResults
  }
  //plotHospitalData=true;
  plotData(4, date);
  let newtitle = "";
  if (pin) {
    newtitle = `Vaccination centers in ${pin} on ${date}`;
    document.title = newtitle;
  } else if (d_id && s_id) {
    let d_name = "";
    d_name = districts.GetName(d_id);
    newtitle = `Vaccination centers in ${d_name} on ${date}`;
    document.title = newtitle;
  }
  $('[data-toggle="popover"]').popover({
    placement: "top",
    html: true,
    content:
      '<a href="javascript:" id="closePopover" class="close btn"data-dismiss="alert">&times;</a><div class="media-body">click here to get more information about this vaccination center</div>',
  });
  $('[data-toggle="popover"]').popover("show");
  document.getElementById("hospitalResults").addEventListener(
    "mouseover",
    (e) => {
      if (e.target.id.includes("Hospital") && e.target.id != "HospitalRes") {
        e.target.click();
      }
    },
    false
  );
}
/*
type = 3 => plot data date-wise with only number of total available slots to be shown.
type = 4 => plot data hospital wise on a particular date. 
*/
function plotData(type, date) {
  let usefulData = results.filterData();
  let previousSelectedState = sessionStorage.getItem("currentState");
  let previousSelectedDistrict = sessionStorage.getItem("currentDistrict");
  let previousPincodeValue = sessionStorage.getItem("pin");
  let OnDistrictTab = previousPincodeValue ? false : true;
  let districts = window.districts.All();
  let states = window.states.All();
  if (type == 3) {
    let dates = [];
    var div = document.getElementById("dateResults");
    if (div) {
      div.innerHTML = "";
    } else {
      div = document.getElementById("res");
      if (div) {
        div.innerHTML = "";
        let newdiv = document.createElement("div");
        newdiv.setAttribute("class", "container h-100");
        newdiv.setAttribute("id", "dateResults");
        div.appendChild(newdiv);
        div = document.getElementById("dateResults");
      } else {
        div = document.getElementById("MainContent");
        div.innerHTML = "";
        div.innerHTML += `<div class="container h-100" id="start">
                 <div class=" d-flex justify-content-center align-items-center">
                             <a href="#" >
                             <button class="btn Button-clicked" id="flexDistrict" onclick="SwithToDistrict()">District</button>
                             </a>
                             <a href="#" >
                                 <button class="btn btn-secondary" id="flexPincode" onclick="SwithToPin()">Pincode</button>
                             </a>
                 </div>
                 <div class="d-flex h-100 justify-content-center align-items-center" id="BeforeStateToPin">
                     <form class="form-group " id="StateToPin1">
                         <div class="form-group ">
                         <label for="state">State</label>
                         <select class="form-control" id="state1" onchange="stateSelected(this.value,1)">
                         </select>
                         </div>
                         <div class="form-group" id="mydiv1">
                         <label for="District">District</label>
                         <select class="form-control" id="district1">
                         </select>
                         </div>
                         <div class="form-group col-sm-4">
                         <button class="btn btn-success my-2 my-sm-0" type="submit" id="DistrictSubmit1">Search</button>
                         </div>
                     </form>
                 </div>
             </div>
             <div class="container h-100">
                 <div class="d-flex h-100 align-items-center justify-content-center">
                     <div class="font-weight-bold">Filters</div>
                     </div>
             </div>${addFilterButtons()}</br>
                 <div id="res">
                 <div id="dateResults" class="container h-100">
                 </div> 
                 </div>`;
        if (!OnDistrictTab) {
          SwithToPin();
          let input = document.getElementById("pininput1");
          input.setAttribute("value", `${previousPincodeValue}`);
        } else {
          let ele = document.getElementById("state1");
          while (ele.hasChildNodes()) {
            ele.removeChild(ele.firstChild);
          }
          for (let i = 0; i < states.length; i++) {
            let option = document.createElement("option");
            if (
              previousSelectedState &&
              states[i]["state_id"] == previousSelectedState
            ) {
              previousSelectedState = null;
              option.setAttribute("selected", "selected");
            }
            option.innerHTML = states[i]["state_name"];
            ele.appendChild(option);
          }
          ele = document.getElementById("district1");
          while (ele.hasChildNodes()) {
            ele.removeChild(ele.firstChild);
          }
          for (let i = 0; i < districts.length; i++) {
            let option = document.createElement("option");
            if (
              previousSelectedDistrict &&
              districts[i]["district_id"] == previousSelectedDistrict
            ) {
              previousSelectedDistrict = null;
              option.setAttribute("selected", "selected");
            }
            option.innerHTML = districts[i]["district_name"];
            ele.appendChild(option);
          }
        }
        div = document.getElementById("dateResults");
      }
    }
    if (usefulData["date"].length == 0) {
      div.innerHTML += alert("no data available for next 7 days");
      return;
    }
    for (let i = 0; i < usefulData["date"].length; i++) {
      dates.push(usefulData["date"][i]["value"]);
    }
    for (let i = 0; i < dates.length; i++) {
      let total = 0;
      let index = 0;
      for (let j = 0; j < usefulData["date"].length; j++) {
        if (usefulData["date"][j]["value"] == dates[i]) {
          index = j;
          break;
        }
      }
      total = usefulData["date"][index]["total"];
      if (total <= 0) {
        total = 0;
        div.innerHTML += `<div class="d-flex align-items-center justify-content-center">
                         <div class="row">
                             <div class="card text-white bg-secondary mb-3" id="req" >
                                 <div class="card-header">${dates[i]}</div>
                                 <div class="card-body">
                                 <h5 class="card-title">Available slots : ${total} <span><a href="javascript:SwitchToHospital('${
          dates[i]
        }')" class="btn disabled"><img src="img/arrow-right.svg"></img></a></span></h5>
                                 <p class="card-text">${addBadges(
                                   usefulData["date"][index]["vaccine"]
                                 )}</p>
                                 </div>
                                 </div>
                             </div>
                         </div>`;
      } else if (total > 0) {
        div.innerHTML += `<div class="d-flex align-items-center justify-content-center">
                         <div class="row">
                             <div class="card text-white bg-success mb-3" id="req" >
                                 <div class="card-header">${dates[i]}</div>
                                 <div class="card-body">
                                 <h5 class="card-title">Available slots : ${total} <span><a href="javascript:SwitchToHospital('${
          dates[i]
        }')" class="btn active"><img src="img/arrow-right.svg"></img></a></span></h5>
                                 <p class="card-text">${addBadges(
                                   usefulData["date"][index]["vaccine"]
                                 )}</p>
                                 </div>
                                 </div>
                             </div>
                         </div>
                     `;
      }
    }
  } else if (type == 4) {
    let index = -1;
    for (let i = 0; i < usefulData["date"].length; i++) {
      if (usefulData["date"][i]["value"] == date) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      index = 0;
      date = usefulData["date"][index]["value"];
      let params = new URLSearchParams(window.location.search);
      if (params.has("pin")) {
        history.replaceState(
          {},
          "",
          `${window.location.pathname}?pin=${params.get("pin")}&n&date=${date}`
        );
      } else if (params.has("dist") && params.has("state")) {
        history.replaceState(
          {},
          "",
          `${window.location.pathname}?dist=${params.get(
            "dist"
          )}&state=${params.get("state")}&n&date=${date}`
        ); // n= hospitalResults
      }
      // history.replaceState: change the provided date to date at index 0.
    }
    showData.plot(usefulData["date"][index]["Hospital"], date, 1);
    if (!sessionStorage.getItem("popover")) {
      sessionStorage.setItem("popover", "y");
      $('[data-toggle="popover"]').popover({
        placement: "top",
        html: true,
        content:
          '<a href="javascript:" id="closePopover" class="close btn"data-dismiss="alert">&times;</a><div class="media-body">click here to get more information about this vaccination center</div>',
      });
      $('[data-toggle="popover"]').popover("show");
    }
  }
}
function previousPage(number) {
  if (showData.currentPage() == 1) {
    document
      .getElementById("PreviousPage")
      .setAttribute("class", "page-item disabled");
    document.getElementById("NextPage").setAttribute("class", "page-item");
    return;
  }
  let params = new URLSearchParams(window.location.search);
  let date = params.get("date");
  let usefulData = results.getCurrentFilteredData();
  let index = 0;
  for (let i = 0; i < usefulData["date"].length; i++) {
    if (usefulData["date"][i]["value"] == date) {
      index = i;
      break;
    }
  }
  if (number == -1) {
    showData.plot(
      usefulData["date"][index]["Hospital"],
      date,
      showData.currentPage() - 1
    );
  } else {
    showData.plot(usefulData["date"][index]["Hospital"], date, number);
  }
}
function nextPage(number) {
  if (showData.currentPage() == showData.TotalPages()) {
    document
      .getElementById("NextPage")
      .setAttribute("class", "page-item disabled");
    document.getElementById("PreviousPage").setAttribute("class", "page-item");
    return;
  }
  let params = new URLSearchParams(window.location.search);
  let date = params.get("date");
  let usefulData = results.getCurrentFilteredData();
  let index = 0;
  for (let i = 0; i < usefulData["date"].length; i++) {
    if (usefulData["date"][i]["value"] == date) {
      index = i;
      break;
    }
  }
  if (number == -2) {
    showData.plot(
      usefulData["date"][index]["Hospital"],
      params.get("date"),
      showData.currentPage() + 1
    );
  } else {
    showData.plot(
      usefulData["date"][index]["Hospital"],
      params.get("date"),
      number
    );
  }
}
function changePage(number) {
  if (showData.currentPage() > number) {
    previousPage(number);
  } else if (showData.currentPage() < number) {
    nextPage(number);
  }
}
var showData = (function () {
  let totalLength = null;
  let maxResultsToShow = 10;
  let NumberOfPages = null;
  let currentDate = null;
  let currentPageNumber = null;
  return {
    plot: function (data, date, pageNumber) {
      if (currentDate && currentDate != date) {
        currentDate = null;
      }
      if (totalLength && totalLength != data.length) {
        currentDate = null;
      }
      if (!currentDate) {
        currentDate = date;
        totalLength = data.length;
        NumberOfPages = Math.ceil(totalLength / parseFloat(maxResultsToShow));
      }
      currentPageNumber = pageNumber;
      let startIndex = (pageNumber - 1) * maxResultsToShow;
      let lastIndex =
        startIndex + maxResultsToShow >= totalLength
          ? totalLength
          : startIndex + maxResultsToShow + 1;
      var div = document.getElementById("hospitalResults");
      if (div) {
        let div1 = document.getElementById("currentdate");
        div1.innerHTML = `${date}`;
        div.innerHTML = "";
        if (data.length == 0) {
          if (
            Button.isClicked("18+") ||
            Button.isClicked("45+") ||
            Button.isClicked("covishield") ||
            Button.isClicked("covaxin") ||
            Button.isClicked("sputnik") ||
            Button.isClicked("free") ||
            Button.isClicked("paid") ||
            Button.isClicked("1stDose") ||
            Button.isClicked("2ndDose")
          ) {
            div.innerHTML += alert(
              "No Data of Vaccination centers available for current set of filters."
            );
          } else {
            div.innerHTML += alert("No Data of Vaccination centers available");
          }
          return;
        }
        div.innerHTML += `<div class="d-flex p-2 align-items-center justify-content-center"><div class="accordion" id="HospitalRes"></div></div>`;
        div = document.getElementById("HospitalRes");
        div.innerHTML = "";
        div.innerHTML += `<div class="card " data-toggle="popover" id="ad" onclick="DelegateClick(${startIndex})"><div class="d-flex card-header ${
          data[startIndex]["1stdose"] > 0 || data[startIndex]["2nddose"] > 0
            ? "btn-success"
            : "btn-secondary"
        } align-items-center justify-content-center" id="Hospital${startIndex}" ><h2 class="mb-0" ><button class="btn collapsed" id="HospitalName${startIndex}" type="button" data-toggle="collapse" data-target="#Hospitaldetails${startIndex}" aria-expanded="false" aria-controls="Hospitaldetails${startIndex}">${
          data[startIndex]["name"]
        }</button></h2></div><div id="Hospitaldetails${startIndex}" class="collapse" aria-labelledby="Hospital${startIndex}" data-parent="#HospitalRes"><div class="card-body" id="HospitalAddress">${
          data[startIndex]["address"]
        }<p>${addBadges(
          data,
          startIndex
        )}</p><ul class="list-group"><li class="list-group-item ${
          data[startIndex]["1stdose"] > 0
            ? "list-group-item-success"
            : "list-group-item-secondary"
        }" id="dose1">${
          data[startIndex]["1stdose"]
        }</li><li class="list-group-item ${
          data[startIndex]["2nddose"] > 0
            ? "list-group-item-success"
            : "list-group-item-secondary"
        }" id="dose2">${
          data[startIndex]["2nddose"]
        }</li></ul></div></div></div>`;
        for (let i = startIndex + 1; i < lastIndex; i++) {
          div.innerHTML += `<div class="card" onclick="DelegateClick(${i})"><div class="d-flex card-header ${
            data[i]["1stdose"] > 0 || data[i]["2nddose"] > 0
              ? "btn-success"
              : "btn-secondary"
          } align-items-center justify-content-center" id="Hospital${i}" ><h2 class="mb-0" ><button class="btn collapsed" id="HospitalName${i}" type="button" data-toggle="collapse" data-target="#Hospitaldetails${i}" aria-expanded="false" aria-controls="Hospitaldetails${i}">${
            data[i]["name"]
          }</button></h2></div><div id="Hospitaldetails${i}" class="collapse" aria-labelledby="Hospital${i}" data-parent="#HospitalRes"><div class="card-body" id="HospitalAddress">${
            data[i]["address"]
          }<p>${addBadges(
            data,
            i
          )}</p><ul class="list-group"><li class="list-group-item ${
            data[i]["1stdose"] > 0
              ? "list-group-item-success"
              : "list-group-item-secondary"
          }" id="dose1">${data[i]["1stdose"]}</li><li class="list-group-item ${
            data[i]["2nddose"] > 0
              ? "list-group-item-success"
              : "list-group-item-secondary"
          }" id="dose2">${data[i]["2nddose"]}</li></ul></div></div></div>`;
        }
      } else {
        div = document.getElementById("MainContent");
        div.innerHTML = "";
        if (data.length == 0) {
          div.innerHTML += `<div class="d-flex justify-content-start"><div class="p-2"><a href="javascript:GoBackToDateResults()" title="go back" class="btn active" id="gobackanchor"><img src="img/arrow-left.svg" alt="go back"></a></div></div>`;
          if (
            Button.isClicked("18+") ||
            Button.isClicked("45+") ||
            Button.isClicked("covishield") ||
            Button.isClicked("covaxin") ||
            Button.isClicked("sputnik") ||
            Button.isClicked("free") ||
            Button.isClicked("paid") ||
            Button.isClicked("1stDose") ||
            Button.isClicked("2ndDose")
          ) {
            div.innerHTML += alert(
              "No Data of Vaccination centers available for current set of filters."
            );
          } else {
            div.innerHTML += alert("No Data of Vaccination centers available");
          }
          return;
        }
        //  div.innerHTML+=`<div class="d-flex justify-content-start"><div class="p-2"><a href="javascript:GoBackToDateResults()" title="go back" class="btn active" id="gobackanchor"><img src="img/arrow-left.svg" alt="go back"></a></div></div>`;
        div.innerHTML += `<div class="d-flex justify-content-between" id="dateShift">
                                    <div class="p-2"><a href="javascript:Previousdate()" title="goto previous date" id="previousdateanchor" class="btn active"><img src="img/arrow-left.svg" alt="goto previous date" id="dateshiftleft"></a></div><div class="p-2 font-weight-bold" title="current date" id="currentdate">${currentDate}</div><div class="p-2"><a href="javascript:Nextdate()" title="goto next date" id="nextdateanchor" class="btn active"><img src="img/arrow-right.svg" alt="goto next date" id="dateshiftright"></a></div></div>`;

        addFilterButtons(div);
        div.innerHTML += `<div id="hospitalResults"></div>`;
        div = document.getElementById("hospitalResults");
        div.innerHTML += `<div class="d-flex p-2 align-items-center justify-content-center"><div class="accordion" id="HospitalRes"></div></div>`;
        div = document.getElementById("HospitalRes");
        div.innerHTML = "";
        div.innerHTML += `<div class="card " id="ad" data-toggle="popover" onclick="DelegateClick(${startIndex})"><div class="d-flex card-header ${
          data[startIndex]["1stdose"] > 0 || data[startIndex]["2nddose"] > 0
            ? "btn-success"
            : "btn-secondary"
        } align-items-center justify-content-center" id="Hospital${startIndex}"><h2 class="mb-0" ><button class="btn collapsed" id="HospitalName${startIndex}" type="button" data-toggle="collapse" data-target="#Hospitaldetails${startIndex}" aria-expanded="false" aria-controls="Hospitaldetails${startIndex}">${
          data[startIndex]["name"]
        }</button></h2></div><div id="Hospitaldetails${startIndex}" class="collapse" aria-labelledby="Hospital${startIndex}" data-parent="#HospitalRes"><div class="card-body" id="HospitalAddress">${
          data[startIndex]["address"]
        }<p>${addBadges(
          data,
          startIndex
        )}</p><ul class="list-group"><li class="list-group-item ${
          data[startIndex]["1stdose"] > 0
            ? "list-group-item-success"
            : "list-group-item-secondary"
        }" id="dose1">${
          data[startIndex]["1stdose"]
        }</li><li class="list-group-item ${
          data[startIndex]["2nddose"] > 0
            ? "list-group-item-success"
            : "list-group-item-secondary"
        }" id="dose2">${
          data[startIndex]["2nddose"]
        }</li></ul></div></div></div>`;
        for (let i = startIndex + 1; i < lastIndex; i++) {
          div.innerHTML += `<div class="card" onclick="DelegateClick(${i})"><div class="d-flex card-header ${
            data[i]["1stdose"] > 0 || data[i]["2nddose"] > 0
              ? "btn-success"
              : "btn-secondary"
          } align-items-center justify-content-center" id="Hospital${i}"><h2 class="mb-0"><button class="btn collapsed" id="HospitalName${i}" type="button" data-toggle="collapse" data-target="#Hospitaldetails${i}" aria-expanded="false" aria-controls="Hospitaldetails${i}">${
            data[i]["name"]
          }</button></h2></div><div id="Hospitaldetails${i}" class="collapse" aria-labelledby="Hospital${i}" data-parent="#HospitalRes"><div class="card-body" id="HospitalAddress">${
            data[i]["address"]
          }<p>${addBadges(
            data,
            i
          )}</p><ul class="list-group"><li class="list-group-item ${
            data[i]["1stdose"] > 0
              ? "list-group-item-success"
              : "list-group-item-secondary"
          }" id="dose1">${data[i]["1stdose"]}</li><li class="list-group-item ${
            data[i]["2nddose"] > 0
              ? "list-group-item-success"
              : "list-group-item-secondary"
          }" id="dose2">${data[i]["2nddose"]}</li></ul></div></div></div>`;
        }
      }
      let pageStart = 1;
      let PageEnd = NumberOfPages + 1;
      if (NumberOfPages > 5) {
        if (currentPageNumber > 5) {
          pageStart = 5 * Math.floor(currentPageNumber / 5.0);
          PageEnd = pageStart + 5;
          if (PageEnd >= NumberOfPages) {
            PageEnd = NumberOfPages + 1;
          }
        } else {
          pageStart = 1;
          PageEnd = 6;
        }
      }
      let s = `<nav aria-label="Vaccination Centers Page navigation">
            <ul id="PageNavUl" class="pagination justify-content-center">
                <li class="page-item" id="PreviousPage">
                <a  id="PrevA" class="page-link text-white bg-secondary" href="javascript:previousPage(-1)" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>`;
      for (let i = pageStart; i < PageEnd; i++) {
        s += `<li class="page-item"><a id="pagination1" class="page-link ${
          currentPageNumber == i
            ? "bg-color text-dark"
            : "bg-secondary text-white"
        } " href="javascript:changePage(${i})">${i}</a></li>`;
      }
      s += `<li class="page-item" id="NextPage"><a id="NextA" class="page-link text-white bg-secondary" href="javascript:nextPage(-2)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></nav>`;
      div.innerHTML += s;
      s = `<div class=" d-flex justify-content-center text-dark">Showing Page Number ${currentPageNumber} of Total ${NumberOfPages} Pages</div>`;
      div.innerHTML += s;
    },
    TotalPages: function () {
      return NumberOfPages;
    },
    currentPage: function () {
      return currentPageNumber;
    },
    clear: function () {
      totalLength = null;
      NumberOfPages = null;
      currentDate = null;
      currentPageNumber = null;
    },
  };
})();
function addFilterButtons(obj) {
  if (typeof obj != "undefined") {
    obj.innerHTML += `<div class="d-flex align-items-center justify-content-center" id="filters">
        <div class="btn-group">
            <button type="button" id="agefilter" class="btn ${
              Button.isClicked("18+") || Button.isClicked("45+")
                ? "Button-clicked"
                : "btn-secondary"
            } dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${
              Button.isClicked("18+")
                ? "18+"
                : Button.isClicked("45+")
                ? "45+"
                : "18+"
            }
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="agefilter1" href="javascript:Button.click('18+')">18+</a>
              <a class="dropdown-item" id="agefilter2" href="javascript:Button.click('45+')">45+</a>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" id="vaccinefilter" class="btn ${
              Button.isClicked("covishield") ||
              Button.isClicked("covaxin") ||
              Button.isClicked("sputnik")
                ? "Button-clicked"
                : "btn-secondary"
            } dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${
              Button.isClicked("covishield")
                ? "COVISHIELD"
                : Button.isClicked("covaxin")
                ? "COVAXIN"
                : Button.isClicked("sputnik v")
                ? "SPUTNIK V"
                : "COVISHIELD"
            }  
            </button>
            <div class="dropdown-menu">
                <a class="dropdown-item" id="vaccinefilter1" href="javascript:Button.click('covishield')">COVISHIELD</a>
              <a class="dropdown-item" id="vaccinefilter2"   href="javascript:Button.click('covaxin')">COVAXIN</a>
              <a class="dropdown-item" id="vaccinefilter3"   href="javascript:Button.click('sputnik v')">SPUTNIK V</a>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" id="feefilter" class="btn  ${
              Button.isClicked("free") || Button.isClicked("paid")
                ? "Button-clicked"
                : "btn-secondary"
            } dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${
              Button.isClicked("free")
                ? "free"
                : Button.isClicked("paid")
                ? "paid"
                : "free"
            }
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="feefilter1" href="javascript:Button.click('free')">free</a>
              <a class="dropdown-item" id="feefilter2" href="javascript:Button.click('paid')">paid</a>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" id="dosefilter" class="btn ${
              Button.isClicked("1stDose") || Button.isClicked("2ndDose")
                ? "Button-clicked"
                : "btn-secondary"
            } dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${
              Button.isClicked("1stDose")
                ? "1stDose"
                : Button.isClicked("2ndDose")
                ? "2ndDose"
                : "1stDose"
            }
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="dosefilter1" href="javascript:Button.click('1stDose')">1stDose</a>
              <a class="dropdown-item" id="dosefilter2" href="javascript:Button.click('2ndDose')">2ndDose</a>
            </div>
        </div>
    </div>`;
  } else {
    return `<div class="d-flex align-items-center justify-content-center" id="filters">
        <div class="btn-group">
            <button type="button" id="agefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              18+
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="agefilter1" href="javascript:Button.click('18+')">18+</a>
              <a class="dropdown-item" id="agefilter2" href="javascript:Button.click('45+')">45+</a>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" id="vaccinefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              COVISHIELD
            </button>
            <div class="dropdown-menu">
                <a class="dropdown-item" id="vaccinefilter1" href="javascript:Button.click('covishield)">COVISHIELD</a>
              <a class="dropdown-item" id="vaccinefilter2"   href="javascript:Button.click('covaxin')">COVAXIN</a>
              <a class="dropdown-item" id="vaccinefilter3"   href="javascript:Button.click('sputnik v')">SPUTNIK V</a>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" id="feefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              free
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="feefilter1" href="javascript:Button.click('free')">free</a>
              <a class="dropdown-item" id="feefilter2" href="javascript:Button.click('paid')">paid</a>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" id="dosefilter" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              1stDose
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" id="dosefilter1" href="javascript:Button.click('1stDose')">1stDose</a>
              <a class="dropdown-item" id="dosefilter2" href="javascript:Button.click('2ndDose')">2ndDose</a>
            </div>
        </div>
    </div>`;
  }
}
function addBadges(obj, index) {
  if (Array.isArray(obj)) {
    // true => hospital data
    if (obj.length == 0) {
      return "";
    } else {
      let res = `<span class="badge badge-info" title="this date has this vaccine available">${obj[index]["vaccine"]}</span> `;
      res += `<span class="badge badge-info" title="this date has vaccines available for this age-group">${
        obj[index]["min_age"] + "+"
      }</span> `;
      res += `<span class="badge badge-info" title="this date has vaccines available by this mode of payment">${
        obj[index]["fee_type"] == "Paid"
          ? "Paid(&#x20B9; " + obj[index]["fees"] + ")"
          : "Free"
      }</span> `;
      if (obj[index]["1stdose"] > 0) {
        res += `<span class="badge badge-info" title="this date has vaccines available for 1stdose of vaccination">1stdose</span> `;
      }
      if (obj[index]["2nddose"] > 0) {
        res += `<span class="badge badge-info" title="this date has vaccines available for 2nddose of vaccination">2nddose</span> `;
      }
      return res;
    }
  } else {
    // date wise
    let vaccine_names = Object.getOwnPropertyNames(obj);
    var res = null;
    if (vaccine_names.length == 0) {
      return "";
    }
    res = "";
    for (let i = 0; i < vaccine_names.length; i++) {
      res += `<span class="badge badge-info" title="this date has this vaccine available">${vaccine_names[i]}</span> `;
    }
    let ToNotBeAdded = [];
    for (let i = 0; i < vaccine_names.length; i++) {
      let age_list = Object.getOwnPropertyNames(obj[`${vaccine_names[i]}`]);
      for (let j = 0; j < age_list.length; j++) {
        if (!ToNotBeAdded.includes(age_list[j])) {
          ToNotBeAdded.push(age_list[j]);
          res += `<span class="badge badge-info" title="this date has vaccines available for this age-group">${
            age_list[j] + "+"
          }</span> `;
        }
      }
    }
    ToNotBeAdded = [];
    for (let i = 0; i < vaccine_names.length; i++) {
      let age_list = Object.getOwnPropertyNames(obj[`${vaccine_names[i]}`]);
      for (let j = 0; j < age_list.length; j++) {
        let dose_list = Object.getOwnPropertyNames(
          obj[`${vaccine_names[i]}`][`${age_list[j]}`]
        );
        for (let k = 0; k < dose_list.length; k++) {
          let fee_list = Object.getOwnPropertyNames(
            obj[`${vaccine_names[i]}`][`${age_list[j]}`][`${dose_list[k]}`]
          );
          for (let l = 0; l < fee_list.length; l++) {
            if (
              obj[`${vaccine_names[i]}`][`${age_list[j]}`][`${dose_list[k]}`][
                `${fee_list[l]}`
              ] > 0
            ) {
              if (!ToNotBeAdded.includes(fee_list[l])) {
                ToNotBeAdded.push(fee_list[l]);
                res += `<span class="badge badge-info" title="this date has vaccines available by this mode of payment">${fee_list[l]}</span> `;
              }
            }
          }
        }
      }
    }
    ToNotBeAdded = [];
    for (let i = 0; i < vaccine_names.length; i++) {
      let age_list = Object.getOwnPropertyNames(obj[`${vaccine_names[i]}`]);
      for (let j = 0; j < age_list.length; j++) {
        let dose_list = Object.getOwnPropertyNames(
          obj[`${vaccine_names[i]}`][`${age_list[j]}`]
        );
        for (let k = 0; k < dose_list.length; k++) {
          if (!ToNotBeAdded.includes(dose_list[k])) {
            ToNotBeAdded.push(dose_list[k]);
            res += `<span class="badge badge-info" title="this date has vaccines available for ${dose_list[k]}">${dose_list[k]}</span> `;
          }
        }
      }
    }
    return res;
  }
}

function DelegateClick(val) {
  if (typeof val == "number") {
    let btn = document.getElementById(`HospitalName${val}`);
    if (btn) {
      btn.click();
    }
  }
}
function ConvertData(data) {
  let date = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].sessions.length; j++) {
      if (!date.includes(data[i].sessions[j].date)) {
        date.push(data[i].sessions[j].date);
      }
    }
  }
  var res = {};
  var datearray = [];
  let vaccines = ["COVISHIELD", "COVAXIN", "SPUTNIK V"];
  let age_limits = [18, 45];
  for (let i = 0; i < date.length; i++) {
    let datetemp = {};
    var hospitaltemp = [];
    datetemp["value"] = date[i];
    datetemp["total"] = 0;
    for (let j = 0; j < data.length; j++) {
      for (let k = 0; k < data[j].sessions.length; k++) {
        if (data[j]["sessions"][k]["date"] != date[i]) {
          continue;
        }
        var hospitaldatatemp = {};
        let vaccinetemp = {};
        let vaccinedatatemp = {};
        let firstdosetemp = {};
        let seconddosetemp = {};
        let dosetemp = {};
        firstdosetemp["free"] = 0;
        firstdosetemp["paid"] = 0;
        seconddosetemp["free"] = 0;
        seconddosetemp["paid"] = 0;
        hospitaldatatemp["address"] = data[j]["address"];
        hospitaldatatemp["name"] = data[j]["name"];
        hospitaldatatemp["vaccine"] = data[j]["sessions"][k]["vaccine"];
        hospitaldatatemp["fee_type"] = data[j]["fee_type"];
        hospitaldatatemp["1stdose"] =
          data[j]["sessions"][k]["available_capacity_dose1"];
        hospitaldatatemp["2nddose"] =
          data[j]["sessions"][k]["available_capacity_dose2"];
        hospitaldatatemp["min_age"] = data[j]["sessions"][k]["min_age_limit"];
        if ("vaccine_fees" in data[j]) {
          for (let l = data[j]["vaccine_fees"].length - 1; l >= 0; l--) {
            if (
              (data[j]["vaccine_fees"][l]["vaccine"] =
                hospitaldatatemp["vaccine"])
            ) {
              hospitaldatatemp["fees"] = Number(
                data[j]["vaccine_fees"][l]["fee"]
              );
              break;
            }
          }
        }
        hospitaltemp.push(hospitaldatatemp);
        if (data[j].fee_type == "Free") {
          firstdosetemp["free"] += data[j].sessions[k].available_capacity_dose1;
          seconddosetemp["free"] +=
            data[j].sessions[k].available_capacity_dose2;
          datetemp["total"] += firstdosetemp["free"] + seconddosetemp["free"];
        } else {
          firstdosetemp["paid"] += data[j].sessions[k].available_capacity_dose1;
          seconddosetemp["paid"] +=
            data[j].sessions[k].available_capacity_dose2;
          datetemp["total"] += firstdosetemp["paid"] + seconddosetemp["paid"];
        }
        if (dosetemp.hasOwnProperty("1stdose")) {
          dosetemp["1stdose"].free += firstdosetemp.free;
          dosetemp["1stdose"].paid += firstdosetemp.paid;
        } else {
          dosetemp["1stdose"] = firstdosetemp;
        }
        if (dosetemp.hasOwnProperty("2nddose")) {
          dosetemp["2nddose"].free += seconddosetemp.free;
          dosetemp["2nddose"].paid += seconddosetemp.paid;
        } else {
          dosetemp["2nddose"] = seconddosetemp;
        }
        for (let m = 0; m < age_limits.length; m++) {
          if (data[j]["sessions"][k]["min_age_limit"] == age_limits[m]) {
            if (vaccinedatatemp.hasOwnProperty(age_limits[m])) {
              vaccinedatatemp[`${age_limits[m]}`]["1stdose"]["free"] +=
                dosetemp["1stdose"]["free"];
              vaccinedatatemp[`${age_limits[m]}`]["1stdose"]["paid"] +=
                dosetemp["1stdose"]["paid"];
              vaccinedatatemp[`${age_limits[m]}`]["2nddose"]["free"] +=
                dosetemp["2nddose"]["free"];
              vaccinedatatemp[`${age_limits[m]}`]["2nddose"]["paid"] +=
                dosetemp["2nddose"]["paid"];
            } else {
              vaccinedatatemp[`${age_limits[m]}`] = dosetemp;
            }
          }
        }
        for (let m = 0; m < vaccines.length; m++) {
          if (data[j]["sessions"][k]["vaccine"] == vaccines[m]) {
            if (vaccinetemp.hasOwnProperty(vaccines[m])) {
              for (let l = 0; l < age_limits.length; l++) {
                if (vaccinetemp[vaccines[m]].hasOwnProperty(age_limits[l])) {
                  if (vaccinedatatemp.hasOwnProperty(age_limits[l])) {
                    vaccinetemp[vaccines[m]][age_limits[l]]["1stdose"][
                      "free"
                    ] += vaccinedatatemp[age_limits[l]]["1stdose"]["free"];
                    vaccinetemp[vaccines[m]][age_limits[l]]["1stdose"][
                      "paid"
                    ] += vaccinedatatemp[age_limits[l]]["1stdose"]["paid"];
                    vaccinetemp[vaccines[m]][age_limits[l]]["2nddose"][
                      "free"
                    ] += vaccinedatatemp[age_limits[l]]["2nddose"]["free"];
                    vaccinetemp[vaccines[m]][age_limits[l]]["2nddose"][
                      "paid"
                    ] += vaccinedatatemp[age_limits[l]]["2nddose"]["paid"];
                  }
                }
              }
            } else {
              vaccinetemp[vaccines[m]] = vaccinedatatemp;
            }
          }
        }
        if (datetemp.hasOwnProperty("vaccine")) {
          for (let m = 0; m < vaccines.length; m++) {
            if (datetemp["vaccine"].hasOwnProperty(vaccines[m])) {
              let arr = Object.getOwnPropertyNames(vaccinetemp);
              if (vaccinetemp.hasOwnProperty(vaccines[m])) {
                if (datetemp["vaccine"][vaccines[m]].hasOwnProperty(18)) {
                  if (vaccinetemp[vaccines[m]].hasOwnProperty(18)) {
                    datetemp["vaccine"][vaccines[m]]["18"]["1stdose"]["free"] +=
                      vaccinetemp[vaccines[m]]["18"]["1stdose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["18"]["1stdose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["18"]["1stdose"]["paid"];
                    datetemp["vaccine"][vaccines[m]]["18"]["2nddose"]["free"] +=
                      vaccinetemp[vaccines[m]]["18"]["2nddose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["18"]["2nddose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["18"]["2nddose"]["paid"];
                  } else if (
                    !datetemp["vaccine"][vaccines[m]].hasOwnProperty(45) &&
                    vaccinetemp[vaccines[m]].hasOwnProperty(45)
                  ) {
                    datetemp["vaccine"][vaccines[m]]["45"] =
                      vaccinetemp[vaccines[m]]["45"];
                  } else if (
                    datetemp["vaccine"][vaccines[m]].hasOwnProperty(45) &&
                    vaccinetemp[vaccines[m]].hasOwnProperty(45)
                  ) {
                    datetemp["vaccine"][vaccines[m]]["45"]["1stdose"]["free"] +=
                      vaccinetemp[vaccines[m]]["45"]["1stdose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["45"]["1stdose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["45"]["1stdose"]["paid"];
                    datetemp["vaccine"][vaccines[m]]["45"]["2nddose"]["free"] +=
                      vaccinetemp[vaccines[m]]["45"]["2nddose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["45"]["2nddose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["45"]["2nddose"]["paid"];
                  }
                } else if (
                  datetemp["vaccine"][vaccines[m]].hasOwnProperty(45)
                ) {
                  if (vaccinetemp[vaccines[m]].hasOwnProperty(45)) {
                    datetemp["vaccine"][vaccines[m]]["45"]["1stdose"]["free"] +=
                      vaccinetemp[vaccines[m]]["45"]["1stdose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["45"]["1stdose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["45"]["1stdose"]["paid"];
                    datetemp["vaccine"][vaccines[m]]["45"]["2nddose"]["free"] +=
                      vaccinetemp[vaccines[m]]["45"]["2nddose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["45"]["2nddose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["45"]["2nddose"]["paid"];
                  } else if (
                    !datetemp["vaccine"][vaccines[m]].hasOwnProperty(18) &&
                    vaccinetemp[vaccines[m]].hasOwnProperty(18)
                  ) {
                    datetemp["vaccine"][vaccines[m]]["18"] =
                      vaccinetemp[vaccines[m]]["18"];
                  } else if (
                    datetemp["vaccine"][vaccines[m]].hasOwnProperty(18) &&
                    vaccinetemp[vaccines[m]].hasOwnProperty(18)
                  ) {
                    datetemp["vaccine"][vaccines[m]]["18"]["1stdose"]["free"] +=
                      vaccinetemp[vaccines[m]]["18"]["1stdose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["18"]["1stdose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["18"]["1stdose"]["paid"];
                    datetemp["vaccine"][vaccines[m]]["18"]["2nddose"]["free"] +=
                      vaccinetemp[vaccines[m]]["18"]["2nddose"]["free"];
                    datetemp["vaccine"][vaccines[m]]["18"]["2nddose"]["paid"] +=
                      vaccinetemp[vaccines[m]]["18"]["2nddose"]["paid"];
                  }
                }
              } else if (datetemp["vaccine"].hasOwnProperty(`${arr[0]}`)) {
                if (
                  datetemp["vaccine"][`${arr[0]}`].hasOwnProperty(18) &&
                  vaccinetemp[`${arr[0]}`].hasOwnProperty(18)
                ) {
                  datetemp["vaccine"][`${arr[0]}`]["18"]["1stdose"]["free"] +=
                    vaccinetemp[`${arr[0]}`]["18"]["1stdose"]["free"];
                  datetemp["vaccine"][`${arr[0]}`]["18"]["1stdose"]["paid"] +=
                    vaccinetemp[`${arr[0]}`]["18"]["1stdose"]["paid"];
                  datetemp["vaccine"][`${arr[0]}`]["18"]["2nddose"]["free"] +=
                    vaccinetemp[`${arr[0]}`]["18"]["2nddose"]["free"];
                  datetemp["vaccine"][`${arr[0]}`]["18"]["2nddose"]["paid"] +=
                    vaccinetemp[`${arr[0]}`]["18"]["2nddose"]["paid"];
                } else if (
                  datetemp["vaccine"][`${arr[0]}`].hasOwnProperty(45) &&
                  vaccinetemp[`${arr[0]}`].hasOwnProperty(45)
                ) {
                  datetemp["vaccine"][`${arr[0]}`]["45"]["1stdose"]["free"] +=
                    vaccinetemp[`${arr[0]}`]["45"]["1stdose"]["free"];
                  datetemp["vaccine"][`${arr[0]}`]["45"]["1stdose"]["paid"] +=
                    vaccinetemp[`${arr[0]}`]["45"]["1stdose"]["paid"];
                  datetemp["vaccine"][`${arr[0]}`]["45"]["2nddose"]["free"] +=
                    vaccinetemp[`${arr[0]}`]["45"]["2nddose"]["free"];
                  datetemp["vaccine"][`${arr[0]}`]["45"]["2nddose"]["paid"] +=
                    vaccinetemp[`${arr[0]}`]["45"]["2nddose"]["paid"];
                } else {
                  let age = Object.getOwnPropertyNames(
                    vaccinetemp[`${arr[0]}`]
                  );
                  datetemp["vaccine"][`${arr[0]}`][`${age}`] =
                    vaccinetemp[`${arr[0]}`][`${age}`];
                }
              } else {
                datetemp["vaccine"][`${arr[0]}`] = vaccinetemp[`${arr[0]}`];
              }
            }
          }
        } else {
          datetemp["vaccine"] = vaccinetemp;
        }
      }
    }
    datetemp["Hospital"] = hospitaltemp;
    datearray.push(datetemp);
  }
  datearray.sort((a, b) => {
    let date1 = a["value"].split("-");
    let date2 = b["value"].split("-");
    let dateObject1 = new Date(+date1[2], date1[1] - 1, +date1[0]);
    let dateObject2 = new Date(+date2[2], date2[1] - 1, +date2[0]);
    return dateObject1 - dateObject2;
  });
  res["date"] = datearray;
  return res;
}
function validatePin(str) {
  let pattern = new RegExp("^[1-9]{1}[0-9]{2}[0-9]{3}$");
  return pattern.test(str);
}
function PinValid(type) {
  var val;
  if (type == 1) {
    val = document.getElementById("pininput1").value;
  } else {
    val = document.getElementById("pininput0").value;
  }
  if (validatePin(val)) {
    document.getElementById(`PinButton${type}`).removeAttribute("disabled");
    let ip = 0;
    if (type == 1) {
      ip = document.getElementById("pininput1");
    } else {
      ip = document.getElementById("pininput0");
    }
    ip.setAttribute("class", "form-control mr-sm-2 bg-white text-black");
    let d = document.getElementById("invalid-feedback");
    if (d) {
      d.remove();
    }
  } else {
    document
      .getElementById(`PinButton${type}`)
      .setAttribute("disabled", "disabled");
    let d = document.getElementById("dateResults");
    if (d) {
      d.innerHTML = "";
    }
  }
}

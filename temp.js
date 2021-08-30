function ConvertData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].sessions.length; j++) {
      if (
        typeof result.find((e) => e.value === data[i].sessions[j].date) ===
        "undefined"
      ) {
        result.push({
          value: data[i].sessions[j].date,
          fee_type: [data[i].fee_type],
          available_capacity: 0,
          available_capacity_dose1: 0,
          available_capacity_dose2: 0,
          available_capacity_dose3: 0,
          Hospital: [],
          vaccine: {},
        });
      }
    }
  }
  result.sort((a, b) => {
    let date1 = a["value"].split("-");
    let date2 = b["value"].split("-");
    let dateObject1 = new Date(+date1[2], date1[1] - 1, +date1[0]);
    let dateObject2 = new Date(+date2[2], date2[1] - 1, +date2[0]);
    return dateObject1 - dateObject2;
  });
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].sessions.length; j++) {
      let index = result.findIndex((e) => {
        return e.value === data[i].sessions[j].date;
      });
      if (index != -1) {
        let arr = [12, 18, 45];
        result[index].available_capacity +=
          data[i].sessions[j].available_capacity;
        result[index].available_capacity_dose1 +=
          data[i].sessions[j].available_capacity_dose1;
        result[index].available_capacity_dose2 +=
          data[i].sessions[j].available_capacity_dose2;
        if ("available_capacity_dose3" in data[i].sessions[j]) {
          result[index].available_capacity_dose3 +=
            data[i].sessions[j].available_capacity_dose3 || 0;
        }
        if (!result[index].fee_type.includes(data[i].fee_type)) {
          result[index].fee_type.push(data[i].fee_type);
        }
        if (!(data[i].sessions[j].vaccine in result[index].vaccine)) {
          result[index].vaccine[`${data[i].sessions[j].vaccine}`] = {};
        }
        if (
          !(
            data[i].sessions[j].min_age_limit in
            result[index].vaccine[`${data[i].sessions[j].vaccine}`]
          )
        ) {
          result[index].vaccine[`${data[i].sessions[j].vaccine}`][
            `${data[i].sessions[j].min_age_limit}`
          ] = {};
        }
        let id = arr.findIndex((e) => data[i].sessions[j].min_age_limit === e);
        if (data[i].sessions[j].allow_all_age) {
          if (id != -1) {
            for (let k = id + 1; k < arr.length; k++) {
              if (
                !(
                  arr[k] in
                  result[index].vaccine[`${data[i].sessions[j].vaccine}`]
                )
              ) {
                result[index].vaccine[`${data[i].sessions[j].vaccine}`][
                  arr[k]
                ] = {};
              }
            }
          }
        }
        for (let k = id; k < arr.length; k++) {
          if (
            "1stdose" in
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]]
          ) {
            // result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
            //   "1stdose"
            // ] += data[i].sessions[j].available_capacity_dose1;
            if (
              data[i]["fee_type"] in
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "1stDose"
              ]
            ) {
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "1stDose"
              ][`${data[i]["fee_type"]}`] +=
                data[i].sessions[j].available_capacity_dose1;
            } else {
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "1stDose"
              ][`${data[i]["fee_type"]}`] =
                data[i].sessions[j].available_capacity_dose1;
            }
          } else {
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
              "1stdose"
            ] = {};
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
              "1stDose"
            ][`${data[i]["fee_type"]}`] =
              data[i].sessions[j].available_capacity_dose1;
          }
          if (
            "2nddose" in
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]]
          ) {
            // result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
            //   "2nddose"
            // ] += data[i].sessions[j].available_capacity_dose2;
            if (
              data[i]["fee_type"] in
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "2ndDose"
              ]
            ) {
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "2ndDose"
              ][`${data[i]["fee_type"]}`] +=
                data[i].sessions[j].available_capacity_dose2;
            } else {
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "2ndDose"
              ][`${data[i]["fee_type"]}`] =
                data[i].sessions[j].available_capacity_dose2;
            }
          } else {
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
              "2nddose"
            ] = {};
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
              "2ndDose"
            ][`${data[i]["fee_type"]}`] =
              data[i].sessions[j].available_capacity_dose1;
          }
          if (
            "3rddose" in
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]]
          ) {
            // result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
            //   "3rddose"
            // ] += data[i].sessions[j].available_capacity_dose3 || 0;
            if (
              data[i]["fee_type"] in
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "3rdDose"
              ]
            ) {
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "3rdDose"
              ][`${data[i]["fee_type"]}`] +=
                data[i].sessions[j].available_capacity_dose3 || 0;
            } else {
              result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
                "3rdDose"
              ][`${data[i]["fee_type"]}`] =
                data[i].sessions[j].available_capacity_dose3 || 0;
            }
          } else {
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
              "3rddose"
            ] = {};
            result[index].vaccine[`${data[i].sessions[j].vaccine}`][arr[k]][
              "3rdDose"
            ][`${data[i]["fee_type"]}`] =
              data[i].sessions[j].available_capacity_dose3 || 0;
          }
          if (!data[i].sessions[j].allow_all_age) {
            break;
          }
        }
        let fee = null;
        if (/paid/i.test(data[i].fee_type)) {
          if (typeof data[i].vaccine_fees !== "undefined") {
            for (let t = 0; t < data[i].vaccine_fees.length; t++) {
              if (
                data[i].sessions[j].vaccine === data[i].vaccine_fees[t].vaccine
              ) {
                fee = +data[i].vaccine_fees[t].fee;
              }
            }
          } else {
            if (data[i].sessions[j].vaccine === "COVISHIELD") {
              fee = 780;
            } else if (data[i].sessions[j].vaccine === "COVAXIN") {
              fee = 1145;
            } else if (data[i].sessions[j].vaccine === "SPUTNIK V") {
              fee = 1200;
            }
          }
        }
        result[index].Hospital.push({
          name: data[i].name,
          address: data[i].address,
          pincode: data[i].pincode,
          block_name: data[i].block_name,
          district_name: data[i].district_name,
          state_name: data[i].state_name,
          allow_all_age: data[i].sessions[j].allow_all_age,
          min_age_limit: data[i].sessions[j].min_age_limit,
          available_capacity: data[i].sessions[j].available_capacity,
          "1stdose": data[i].sessions[j].available_capacity_dose1,
          "2nddose": data[i].sessions[j].available_capacity_dose2,
          "3rddose": data[i].sessions[j].available_capacity_dose3 || 0,
          fee_type: data[i].fee_type,
          vaccine: data[i].sessions[j].vaccine,
          fees: fee || 0,
        });
      }
    }
  }
  let out = { date: result };
  console.log(out);
  return out;
}

const express = require('express');
const checks = require('../helpers/sanity_checks');
const utils = require('util');
const _ = require('lodash');
const conn = require('../config/config');
const jwt = require("jsonwebtoken");
let nodemailer = require('nodemailer');

const router = express.Router();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'unishubh1@gmail.com',
        pass: 'imshubh008',
    }
});

module.exports.register = async (req, res) => {
    console.log(req.body);
    const name = _.get(req.body, 'name', '');
    const age = _.get(req.body, 'age', '');
    const sex = _.get(req.body, 'sex', '');
    const address = _.get(req.body, 'address', '');
    const password = _.get(req.body, 'password', '');
    const email = _.get(req.body, 'email', '');
    const contact = _.get(req.body, 'contact', '');
    const type = _.get(req.body, 'type', '');
    let data = [name, age, sex,address,email,contact,type, password ];
    let id = 0;
    conn.query("SELECT id FROM users WHERE 1 ORDER BY id DESC LIMIT 1", (err,da) => {
        if(err) {
            console.log(err);
            id=0;
        }
        else{
            console.log(da);
            if (da.length > 0)
            id = da[0].id+1;
            else id =0 ;
        }
    });
    if(false) {
        
        res.status(403);
        res.json({'message':''});
    }
    else {
        console.log(data);
        conn.query("INSERT INTO users (name, age,sex,address,email,contact,type,password) VALUES (?,?,?,?,?,?,?,?)", data, (yes, err) => {
            if(!err) {
                console.log(err);
                res.status(501);
                res.json({'message':'Some inetrnal error'});
            }
            else {

                if(type == 0)
                {
                    
                    const   joined = _.get(req.body,'joined_date', _);
                    const   field = _.get(req.body,'field', _);
                    st = {'id':id,'joined':joined, 'field':field};
                    st = {id,joined,field};
                    add_doctor_data(st);
                    res.status(200);
                    res.json({'message':'Successfully added'});
            
                }
                else if(type == 1)
                {
                    const   date_of_admission = _.get(req.body,'doa', _);
                    const   weight = _.get(req.body,'weight', _);
                    const   height = _.get(req.body,'height', _);
                    const   severity = _.get(req.body,'severity', _);
                    const   blood_pressure = _.get(req.body,'blood_pressure', _);
                    const   sugar_level = _.get(req.body,'sugar_level', _);
                    const   blood_group = _.get(req.body,'blood_group', _);
                    const   temperature = _.get(req.body,'temperature', _);
                    const   heart_rate = _.get(req.body,'heart_rate', _);
                    const   respiration_rate = _.get(req.body,'respiration_rate', _);
                    const   disease_diagnosed = _.get(req.body,'disease_diagnosed', _);

                    st = {id,date_of_admission, weight, height, severity, blood_pressure, sugar_level, blood_group, temperature, heart_rate, respiration_rate, disease_diagnosed };
                    add_patient_data(st);
                    console.log("NOW adding next");
                    const threshold_bp = _.get(req.body, 'threshold_bp');
                    const threshold_temp = _.get(req.body, 'threshold_temp');
                    const threshold_rr = _.get(req.body, 'threshold_rr');
                    const threshold_heartrate = _.get(req.body, 'threshold_heartrate');
                    const threshold_sugar = _.get(req.body, 'threshold_sugar');
                    data = [1001,id,threshold_bp, threshold_temp, threshold_rr, threshold_heartrate, threshold_sugar,4,Date.now()];
                    console.log(data);
                    conn.query("INSERT INTO `doctors-patient` (did,pid,threshold_bp, threshold_temp, threshold_rr, threshold_heartrate, threshold_sugar,visit_period,last_visit) VALUES (?,?,?,?,?,?,?,?,?)", data, (error, dat) => {
                        if(error) {
                          //  console.log(error)
                        
                        }
                        else {
                           // console.log("end");
                            res.status(200);
                            res.json({'message':'Successfully added'});
                        }
                    });
                }

                
            }
        });
    }
    
};

const add_patient_data = async (req) => {
    //const pid = await getidfromjwt(req.body.payload.admin);
   // console.log(req);
    const pid = _.get(req, 'id', ' ');
    const   date_of_admission = _.get(req,'date_of_admission', _);
    const   weight = _.get(req,'weight', _);
    const   height = _.get(req,'height', _);
    const   severity = _.get(req,'severity', _);
    const   blood_pressure = _.get(req,'blood_pressure', _);
    const   sugar_level = _.get(req,'sugar_level', _);
    const   blood_group = _.get(req,'blood_group', _);
    const   temperature = _.get(req,'temperature', _);
    const   heart_rate = _.get(req,'heart_rate', _);
    const   respiration_rate = _.get(req,'respiration_rate', _);
    const   disease_diagnosed = _.get(req,'disease_diagnosed', _);

    const data = [pid, date_of_admission,weight,height,severity,blood_pressure,sugar_level,blood_group,temperature, heart_rate, respiration_rate,disease_diagnosed ];
        conn.query("INSERT INTO patient (pid, date_of_admission,weight,height,severity,blood_pressure,sugar_level,blood_group,temperature, heart_rate, respirationrate,disease_diagnosed ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", data, (err, yes) => {
            if(err) {
                console.log(err);
            }
        });

};

const add_doctor_data = async (req) => {
    //console.log(req);
    //const pid = await getidfromjwt(req.body.payload.admin);
    const did = _.get(req, 'did', ' ');
    const   joined = _.get(req,'joined', _);
    const   field = _.get(req,'field', _);
    data = [joined, field];
        conn.query("INSERT INTO doctor ( joined_date, field) VALUES (?,?)", data, (err, yes) => {
            if(err) {
                console.log(err);
            }
        });  

};

module.exports.login = async (req, res) => {
    const name = _.get(req.body, 'name', '');
    const password = _.get(req.body, 'password', '');
    let data = [name, password];
    console.log(data);  
    let token;
    conn.query("SELECT * FROM users WHERE name = ? and password = ?", data, (err, da) => {
        if(err) {
            console.log(err);
            res.status(501);
            res.json({'message':'Some inetrnal error'});
        }
        else {
            console.log(da);
            const payload = {
                admin :  da.id,
            };

            token = jwt.sign(payload, 'thisisnotsospecial', {
                expiresIn: 2592000 // expires in 24 hours
            });
        }
        res.status(200);
        res.json({"message":"User Successfully Loggedin",
                "token": token,
                });
    });
};


module.exports.add_records = async function (req,res){
    const pid = req.body.pid;
    const blood_pressure = req.body.blood_pressure;
    const heart_rate = req.body.heart_rate;
    const respiration_rate = req.body.respiration_rate;
    const temperature = req.body.temperature;
    const sugar_level = req.body.sugar_level;
    const timestamp = Date.now();
    let thresholds;
    try {
        thresholds = await get_thresholds(pid);
        threshold_bp = thresholds['threshold_bp'];
        threshold_heartrate = thresholds['threshold_heartrate'];
        threshold_rr = thresholds['threshold_rr'];
        threshold_sugar=thresholds['threshold_sugar'];
        threshold_temp=thresholds['temp'];
        }
    catch (e) {
        console.log("some issues");
    } 
    console.log(pid);
    let data = [pid, blood_pressure, heart_rate, respiration_rate, temperature, sugar_level,timestamp];
    conn.query("INSERT INTO `patient-live-data` (pid, blood_pressure, heart_rate, respiration_rate, temperature, sugar_level, `timestamp`) VALUES (?,?,?,?,?,?,?)", data, async (err, da) => {
        if(err) {

            console.log(err);
            res.status(501);
            res.json({'message':'Some inetrnal error'});
        }
        else {
        try {
            let data = {pid, blood_pressure, heart_rate, respiration_rate, temperature, sugar_level,timestamp};
            let datat = await check_for_thresholds(data, thresholds);
            status = datat.status;
            if(status == 1) 
            {
                name = datat.name;
                let str = "For user "+pid+" "+name+" crosses the thresold defined";
                let sub = 'A patient needs you attention';
                console.log(sub, str);
                sendMail(str);
            }
        }
        catch (e) {
            console.log("Could not send notification");
            console.log(e);
        }
        res.status(200);
        res.json({"message":"User Successfully added data"});
        }
    });
};

module.exports.get_records = async (req,res) => {
    const pid = req.body.pid;
    const time = req.body.time;
    let timestamp = time*60*1000;
    timestamp = Date.now() - timestamp;
    let data = [pid, timestamp];
    
    conn.query("SELECT * FROM `patient-live-data` WHERE pid = ? and `timestamp` >= ?", data, (err, da) => {
        if(err) {

            console.log(err);
            res.status(501);
            res.json({'message':'Some inetrnal error'});
        }
        else {

        conn.query("SELECT MAX(`heart_rate`) as max_heart_rate, MIN(`heart_rate`) as min_heart_rate, MAX(`blood_pressure`) as max_blood_pressure, MIN(`blood_pressure`) as min_blood_pressure, MAX(`temperature`) as max_temperature, MIN(`temperature`) as min_temperature, MAX(`respiration_rate`) as max_respirationrate, MIN(`respiration_rate`) as min_respirationrate, MAX(`sugar_level`) as max_sugar_level, MIN(`sugar_level`) as min_sugar_level FROM `patient-live-data` WHERE pid = ? and `timestamp` >= ?",data, (erro, dat)=>{
            if(erro) {
                console.log(erro);
            }
            else {
        conn.query("SELECT count(*) as cnt FROM `patient-live-data` JOIN `doctors-patient` on `patient-live-data`.pid = `doctors-patient`.pid WHERE `doctors-patient`.pid=? AND (heart_rate > threshold_heartrate OR blood_pressure > threshold_bp OR temperature > threshold_temp OR respiration_rate > threshold_rr OR sugar_level > threshold_sugar) AND `timestamp` >= ?",[pid, timestamp], (ers,dts) => {
            if(ers) {
                console.log(ers);

            }
            else {
                res.status(200);
                res.json({"data":da, "max_heart_rate":dat[0].max_heart_rate, "min_heart_rate":dat[0].min_heart_rate,"max_blood_pressure":dat[0].max_blood_pressure, "min_blood_pressure":dat[0].min_blood_pressure, "max_temperature":dat[0].max_temperature, "min_temperature":dat[0].min_temperature, "max_respirationrate":dat[0].max_respirationrate, "min_respirationrate":dat[0].min_respirationrate,"max_sugar_level":dat[0].max_sugar_level, "min_sugar_level":dat[0].min_sugar_level, "count":dts[0].cnt});
            }
        });
            }
        });
        }
    });
};

const get_thresholds = async (id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT threshold_bp, threshold_heartrate, threshold_rr, threshold_temp, threshold_sugar FROM `doctors-patient` WHERE pid = ?",id, (err, data)=>{
            if(err)
            {
                console.log(err);
                reject(err);
            }
            else {
            // console.log(data[0].threshold_bp);
                resolve(data[0]);
            }
        });
    });
    
};

const check_for_thresholds = async (data, thresholds) => {
    return new Promise((resolve, reject) => {

    console.log("in here");
        let name; let status;
        if(data.heart_rate > thresholds.threshold_heartrate) {
            status =1; name = "heartrate";
        }
        else if(data.respiration_rate > thresholds.threshold_rr)
        { status = 1 ;name = "respiration_rate";}
        else if(data.blood_pressure > thresholds.threshold_bp)
        { console.log(data.blood_pressure);console.log(thresholds.threshold_bp);status =1; name = "threshole_bp"}
        else if( data.sugar_level > thresholds.threshold_sugar)
        { status = 1; name = "sugar";}
        else if(data.temperature > thresholds. threshold_temp)
        { status = 1; name="temperature";}
        else { status =0; name =0};
        datat={status, name};
        resolve(datat);
});
};

module.exports.all_patients = async (req,res)=> {
    conn.query("SELECT id,name,age,sex,address,email,contact FROM users WHERE type = 1",(err,data) => {
        if(err) {
            console.log(err);
        }
        else {
            res.status(200);
            res.json({data});
        }
    });
};

const sendMail = async(sub, str) => {

    const mailOptions = {
        from: 'unishubh1@gmail.com', // sender address
        to: 'ritikxman@gmail.com', // list of receivers
        subject: sub, // Subject line
        html: str
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        console.log(err)
        else
        console.log(info);
    });

};

module.exports.mark_visit = async (req,res) => {
    const pid = req.body.pid;
    const did = 1001;
    const time = Date.now();

    conn.query("UPDATE `doctors-patient` SET last_visit = ? WHERE pid = ?", [time,pid], (err,resu)=>{
        console.log(resu);
        if(err) {
            console.log(err);

        }
        else {
            conn.query("INSERT INTO visits (pid, did, time) VALUES (?,?,?)", [pid,did,time], (err2,res2) => {
                if(err2) {
                    console.log(err2);
                }
                else {
                    res.status(200);
                    res.json({"message":"Visit marked"});
                }
            });
        }
    });
};
module.exports.check_visit = async (req,res) => {
    console.log("yaha");
    conn.query("SELECT last_visit,pid FROM users JOIN `doctors-patient` ON users.id = pid WHERE users.type = 1", (err, data) => {
        if(err){
            console.log(err);

        }
        else {
            console.log("Date");
            console.log(data[0].last_visit);
            const fn =async (data) => {
                for (i=0 ; i<data.length; i++ ){
                    console.log(data[i].last_visit);
                    await check_for_mail(data[i].id,data[i].last_visit);
                }
            };
            fn(data);
        }
    });
};

const check_for_mail = async (pid,time) => {
    let name = await getnamefromid(pid);
    return new Promise(async (resolve,reject)=> {
        if((Date.now() - time) >= (4*60*60*1000*0)) {
            let sub = 'You missed a visit';
            let str = 'Sir, you need to visit'+  name + 'as it has been more than 4 hours you last visited him';
            //sendMail(sub, str);
            console.log("should send"+ str);
        }
        resolve();
    });
    
};

const getnamefromid = async (id) => {
    return new Promise((resolve,reject) => {
        //let pid = id;
        //console.log(pid);
        conn.query("SELECT * FROM users WHERE id=?",52, (err,dat)=> {
            if(err) {
                console.log(err);
                reject('');
            }
            else {
                resolve(dat[0].name);
            }
        });
    });
};

module.exports.is_visited = async (req,res) => {
    const pid = req.body.pid;
    conn.query("SELECT last_visit FROM `doctors-patient` WHERE pid=?", pid, (err,dat) => {
        if(err)
        {
            console.log(err);

        }
        else {
            if((Date.now() - dat[0].last_visit) < (4*60*60*1000)) {
                res.status(200);
                res.json({"is_visited":'yes'});
            }
            else {
                res.status(200);
                res.json({"is_visited":'no'});
            }
        }
    });
};

module.exports.disease = async (req, res) => {
    conn.query("SELECT disease_diagnosed,count(*) as cnt FROM patient GROUP BY patient.disease_diagnosed", (err, data) => {
        if(err) {
            console.log(err);
        }
        else {
            res.status(200);
            res.json({data});
        }
    });
};


module.exports.city = async (req,res) => {
    const disease = req.body.disease;
    conn.query("SELECT users.address, count(*) as cnt FROM patient JOIN users ON pid=users.id  WHERE disease_diagnosed=? GROUP BY users.address", disease, (err, data)=> {
        if(err) {
            console.log(err);
        }
        else
        {
            res.json({data});
            res.status(200);
        }
    });
};

module.exports.see_diseases = async (req,res) => {

    conn.query("SELECT distinct `disease_diagnosed`  FROM patient WHERE 1", (err,data)=>{
        if(err) {
            console.log(err);

        }
        else {
            res.status(200);
            res.json({data});
        }
    });
};
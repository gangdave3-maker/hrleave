"use client";

import Cookies from "js-cookie";
import Nav from "../Components/Nav";
import { useEffect, useState} from "react";
import { servitor, leaveBegin, easyDate, updateStatus, deleteLeave } from "../Components/My-function";

function Boss() {
  const [employeeID, setEmployeeID] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [servant, setServant] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const leaveInfo = {
                      request_id:0,
                      status:"",
                    }
  const [leaveChunk,setLeaveChunk] = useState(leaveInfo)

  const prepareLeave=(dataChunk)=>{
    setLeaveChunk(prev=>({
      ...prev,
      request_id:parseInt(dataChunk.request_id),
      status:dataChunk.status.toLowerCase()
    }))
  }

  useEffect(() => {
    const recheck = () => {
      setMounted(true);
      setEmployeeID(Cookies.get("employeeID") || null);
    };
    recheck();
  }, []);

  useEffect(() => {
    const getServant = async () => {
      if (employeeID) {
        const henchman = await servitor(employeeID);
        if (henchman) {
          setServant(henchman);//จะได้Arrayที่ข้างในมีชุดข้อมูลที่เป็นObject เป็นArray ชั้นเดียว และถือเป็นStatementแรกที่จะใช้ในObject.entries(grouped).map()ตอนแสดงผล
        }
      }
    };

    getServant();
  }, [employeeID]);

  useEffect(() => {

    const getAllLeaves = async () => {
      if (Array.isArray(servant) && servant.length > 0) { //แปลว่า servant ต้องมีข้อมูลแล้วเท่านั้น (servant.length > 0)
        //รอรวมRequest หลายๆ Requests ให้ครบในคราวเดียว แล้วยิงไปbackend ทีละหลายๆ Requests ในรอบเดียว
        /*เราทดสอบแล้วค่าservant ยังเป็น Array ชั้นเดียว; แต่ในขั้นตอนของการใช้ Promise.all() ผลลัพธ์ที่ได้จะทำให้เกิด Array ชั้นที่ 2 ขึ้น
        เพราะฟังก์ชั่น leaveBegin()ไปเรียกapiที่ข้างในมีการใช้ prisma.findMany() ซึ่งreturnค่ากลับมาเป็นArray 1ชั้นอยู่แล้วเสมอ เมื่อรวมกับของเก่าที่มีชั้น
        Array อยู่แล้ว1ชั้น มันก็เลยกลายเป็น Array 2 ชั้น(Nested Array)*/
        /*ตัวอย่างชุดข้อมูลรอยิงทีเดียวหลายPromiseจากการใช้ Promise.all()คือ [[Promise],[Promise],[Promise],ฯลฯ] เป็นการจำลองให้โค้ดAsynchronous
        มีการทำงานที่กลับไปเป็นแบบSynchronous คือไม่ต้องรอให้ตัวใดตัวหนึ่งทำงานเสร็จก่อน แต่ยิงรวดเดียวไปเลยครั้งละหลายๆRequest ส่งผลให้โปรแกรมทำงานเร็วขึ้น*/
        const results = await Promise.all( //ที่ต้อง await เพราะฟังก์ชั่น leaveBegin เป็นฟังก์ชั่นแบบ async-await
          servant.map((item) => leaveBegin(item.employee_id)),
        );
        
        // 🔥 ตัวป้องกัน null / undefined
        const filtered = results.filter((item) => item != null); //.filter ใช้ได้กับ array เท่านั้น บรรทัดนี้จะกรองตัวที่มีค่าเป็นnull, undefinedออกไป
        // 🔥 flatten array ซ้อน
        const flat = filtered.flat(); //.flat ใช้ได้กับArray เท่านั้น ทำหน้าที่:“แผ่+ยุบรวมarray ซ้อน(nested array)ที่ซ้อนกันหลายชั้น ให้แบนลงเหลือแค่ชั้นเดียว
        setAllLeaves(flat);//หลังจากผ่านการ .flat() แล้วส่งผลให้ข้อมูล allLeaves เป็นArray ชั้นเดียวที่มีชุดข้อมูลข้างในเป็น Object
      }
    };

    getAllLeaves();
  }, [servant]);

  useEffect(()=>{
    if(leaveChunk.request_id !==0 && leaveChunk.status !== ""){
      updateStatus(leaveChunk)
    }
  },[leaveChunk])

  /*ฟังก์ชั่นที่ทำให้ได้ ชื่อและนามสกุล แบ่งตาม employee_id; ในservant มีค่าของชื่อ นามสกุล คำนำหน้าชื่อ อยู่นั่นเอง ทำให้เมื่อเรียกใช้Key(ค่าemployee_id)
    ก็จะเช้าถึงค่าValueที่เป็นชื่อ-นามสกุลได้*/
  const servantMap = servant.reduce((acc, emp) => { //ใช้.reduce()เพื่อ“แปลงโครงสร้างarray ให้เป็นobject”; acc= accumulator(ตัวสะสม); emp= พนักงานแต่ละคนในarray
    acc[emp.employee_id] = emp; //นำ field employee_id ของแต่ละ item(employee) ซึ่งอยู่ใน servant มากำหนดให้เป็นค่า key ของตัวสะสม acc
    /*returnค่าตัวสะสม(Accumulator) กลับออกไปเป็นค่าของservantMap ผลลัพธ์=employee_id: [{FullNameลูกน้องคนที่1},{FullNameลูกน้องคนที่2},{FullNameลูกน้องคนที่3},
     {FullNameลูกน้องคนที่4},ฯลฯ] ที่ข้างในArray เป็นObject เพราะข้อมูลในservant เป็นObjectมาแต่แรกอยู่แล้ว*/
    return acc; 
  }, {});

  //ฟังก์ชั่นที่ทำให้เกิดการจัดกลุ่มข้อมูลการลาหรือใบลาตามค่าemployee_id ทำให้เมื่อเรียกใช้Key ซึ่งคือemployee_id ก็จะเข้าถึงValue ที่เป็นข้อมูลการลาได้
  const grouped = allLeaves.reduce((acc, item) => { //ใช้.reduce() เพื่อ“แปลงโครงสร้างarray ให้เป็นobject”; ในที่นี้item แทนข้อมูลการลาแต่ละชุด(ตารางleave_requests)
    const key = item.employee_id; //กำหนดให้field employee_id ของสมาชิกแต่ละชุดที่อยู่ใน allLeaves เป็นค่า key
    // ❗ กัน null / undefined ไปเลย
    if (key == null) return acc;
    //ถ้าacc[key] ยังไม่มีค่า(undefined/null) หรือเป็นfalsy ให้สร้างarray ว่างๆขึ้นใหม่ (เปรียบเสมือนกล่องเปล่าที่รอบรรจุใส่ข้อมูลเข้าไป)
    //if (!acc[key]) acc[key] = []; สมัยใหม่จะเขียนว่า acc[key] ??= []; มีความหมายเหมือนกัน
    if (!acc[key]) acc[key] = []; //ถ้ายังไม่มีค่าkey(employee_id) นี้ ให้สร้างarray ว่างๆที่เปรียบเสมือนเป็นกล่องเปล่าๆ ไว้รอใส่ข้อมูลจากค่าitem จะได้ว่า"nullหรือundefined": []
    //ดังนั้นแล้วเมื่อมาถึงโค้ดบรรทัดถัดไป ก็จะได้ว่าemployee_id:[] ทำให้สามารถใช้.push() ได้ เพราะตัวValueมันเป็นArray;
    acc[key].push(item); //acc[key]เป็นเพียงการlookupเพื่อเรียกValue ออกมาทำงาน; เอาitem (ใบลา) ใส่เข้าไปในกลุ่ม(Array)นั้น;
    return acc; /*บรรทัดนี้จะreturn ค่าตัวสะสม(Accumulator) กลับออกไปเป็นค่าของgrouped จะได้ลักษณะทีว่า employee_id : [{ใบลา1},{ใบลา2},{ใบลา3},{ใบลา4},{ใบลา5},ฯลฯ]
                  ที่ข้างในArray เป็นObject เพราะsetAllLeaves(flat);มันผ่านการflatมาแล้วจากบรรทัดconst flat = filtered.flat();*/
  }, {});

  //useEffect(() => {console.log(servant);}, [servant]);
  //useEffect(() => {console.log(allLeaves);}, [allLeaves]);
  //console.log(servantMap)
  //console.log(grouped);

  if (!mounted) return null; // ⬅️ hydration-safe

  return (
    <div>
      <Nav />
      <div className="h-10!"></div>

      <div className="px-3! md:px-10!">
        {
          //การแสดงผลต่อไปนี้จะมีการแสดงผลอยู่2 layers(2 Array)ซ้อนกัน ชั้นนอกสุดจะเป็นlayer ของgrouped (Array grouped) ชั้นในสุดจะเป็นlayer ของleaves (Array leaves)
          /*มี2 ชั้น ชั้นนอกคือArray ที่เกิดจากObject.entries(grouped); 
            ชั้นในคือleaves(ใบลาทุกใบของพนักงานคนนั้นๆที่กำลังประมวลผลอยู่)ซึ่งมีโครงสร้างเป็นArrayอยู่แล้วดังนั้นจึงใช้.mapได้ทันที*/
          //ขั้นตอนของObject.entries() เป็นการloop เพื่อแปลง structure จากobject ให้เป็น Array
          //.map() ใช้ได้กับ Array เท่านั้น
          /*ข้อสังเกตสำคัญคือ ตอนที่เราReturn
          ชั้นนอกสุดใช้{}แทนที่จะใช้()เหมือนที่เคยเขียนปรกติเพราะมันมี 2 statementข้างในคือ 
          statement แรก const emp = servantMap[henchmanID]; เป็นการเอาemployee_idมาเข้าถึงข้อมูลชื่อ-นามสกุลที่อยู่ในservantMap
          statement ที่สองคือส่วนแสดงผล(<div>...</div>) ดังนั้น เราเลยต้องให้เกิดการ return ใน statement ที่สอง 
          โดยเขียน return(<div>...</div>) โดยถ้าหากเป็นกรณีอื่นๆที่มีแค่ statement เดียว เราก็เขียนแบบ implicit โดยใช้ () ได้เลย โดยไม่ต้องใช้ {} นั่นเอง
          */   
         /*ข้อสังเกตเมื่อเทียบกับ .map(index,item)ทั่วไปจะเห็นว่าคล้ายกัน ต่างกันที่มีArrayเข้ามาห่อหุ้มก่อนอีกชั้น; leavesที่ทำหน้าที่เป็นitem คือArray แต่เดิมอยู่แล้ว
         ส่วนhenchmanID ทำหน้าที่เป็น index*/ 
          Object.entries(grouped).map(([henchmanID, leaves]) => { //henchmanID= key เทียบได้กับindex;leaves= arrayของข้อมูลใบลาที่อยู่ในgrouped เทียบได้กับitem
            const emp = servantMap[henchmanID]; //=statementแรก;เป็นการlookupหาข้อมูลในObjectโดยใช้ค่าemployee_idไปค้นหาข้อมูลชื่อนามสกุลพนักงานแต่ละคนในservantMap
            //บรรทัดถัดลงไปเป็นstatementที่สองที่เราจะนำไปแสดงผล จึงต้องมีการ return()
            return (
              // ทั้งservantMap และgrouped ต่างก็มีemployee_id ที่โดนทำให้Unique แล้วเป็นค่าkey; โดยkey ของชั้นนี้ เป็นชั้นของgrouped
              <div key={henchmanID} className="mb-5"> 

                <div className="pb-2">
                  <h3>
                    {/* เราสามารถนำemp มาdot(.)ตรงๆเพื่อแสดงผลได้เพราะservantMap ยังเป็นObjectอยู่ สาเหตุคือservantMap ยังไม่ได้ถูกแปลงให้เป็นArray ด้วยโค้ดObject.entries() นั่นเอง */}
                    {/* นำข้อมูลที่ได้จากการlookupจากstatementแรก(emp)มาแสดงผล */}
                    <span className="underline">{emp?.title_of_courtesy}{emp?.first_name} {emp?.last_name}</span> (Employee ID: {henchmanID})
                  </h3>
                </div>
                {/* เป็นการ loop เพื่อนำข้อมูลใบลาแต่ละชุดมาแสดงผล */}
                {/* .map() ใช้ได้กับ Array เท่านั้น */}
                <div>
                  <div className="row d-none d-md-flex text-center align-items-center fw-bold py-2 bg-light">
                      <div className="col-1"><span className='md:pl-5! md:text-nowrap'>ID</span></div>
                      <div className="col-1"><span className='md:pl-5!'>Type</span></div>
                      <div className="col-2"><span className='md:pl-5!'>Reason</span></div>
                      <div className="col-2"><span className='md:pl-1!'>Start Date</span></div>
                      <div className="col-1"><span className='md:pr-2!'>End Date</span></div>
                      <div className="col-1"><span className='md:pr-2!'>Status</span></div>
                      <div className="col-2"><span className='md:pr-4!'>Updated Date</span></div>
                      <div className="col-2"></div>
                  </div>
                
                {leaves.map((item) => (
                  // keyของชั้นนี้เป็นkeyของใบลาเฉพาะพนักงานemployee_id คนนี้ในแต่ละรอบของการloopเท่านั้น เพราะชั้นนอกมันโดนคุมด้วย <div key={henchmanID} className="mb-4">
                  <div key={item.request_id} className="row text-center align-items-center py-2">
                    {/* Desktop */}
                    <div className="d-none d-md-flex w-100 text-center align-items-center">
                      <div className="col-1">{item.request_id}</div>
                      <div className="col-1">{item.leave_types?.type_name}</div>
                      <div className="col-2 text-start">{item.reason}</div>
                      <div className="col-2">{easyDate(item.start_date)}</div>
                      <div className="col-1">{easyDate(item.end_date)}</div>
                      <div className="col-1">{item.status}</div>
                      <div className="col-2">{easyDate(item.created_at)}</div>
                      <div className="col-2">
                        <div className="flex flex-col lg:flex-row">
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={()=>{
                              const leaveInfo = {
                                request_id:item.request_id,
                                status:"approve"
                              }
                              if(leaveInfo){
                                prepareLeave(leaveInfo)
                              }
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-warning mx-2! my-1! lg:my-0!"
                            onClick={()=>{
                              const leaveInfo = {
                                request_id:item.request_id,
                                status:"pending"
                              }
                              if(leaveInfo){
                                prepareLeave(leaveInfo)
                              }
                            }}
                          >
                            Pending
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={()=>deleteLeave(item.request_id)}>Delete</button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile (แสดงแบบ card) */}
                    <div className="d-block d-md-none text-start">
                      <div><strong>ID:</strong> {item.request_id}</div>
                      <div><strong>Type:</strong> {item.leave_types?.type_name}</div>
                      <div><strong>Reason:</strong> <span className="text-start">{item.reason}</span></div>
                      <div><strong>Start:</strong> {easyDate(item.start_date)}</div>
                      <div><strong>End:</strong> {easyDate(item.end_date)}</div>
                      <div><strong>Status:</strong> {item.status}</div>
                      <div><strong>Submit Date:</strong> {easyDate(item.created_at)}</div>
                      <div>
                        <div>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={()=>{
                              const leaveInfo = {
                                request_id:item.request_id,
                                status:"approve"
                              }
                              if(leaveInfo){
                                prepareLeave(leaveInfo)
                              }
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-warning mx-2!"
                            onClick={()=>{
                              const leaveInfo = {
                                request_id:item.request_id,
                                status:"pending"
                              }
                              if(leaveInfo){
                                prepareLeave(leaveInfo)
                              }
                            }}
                          >
                            Pending
                          </button>
                          <button className="btn btn-sm btn-danger">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                ))}
                </div>

              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default Boss;

import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = "C:/Users/Lenovo LEGION 5/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/output/PCS_Bao_Cao_Chi_Tiet_19_Slide.pptx";
const QA = "C:/Users/Lenovo LEGION 5/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/tmp/presentations/pcs-10-week-summary/tmp/qa-detailed-19";
const DASH = "C:/Users/Lenovo LEGION 5/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/tmp/presentations/pcs-10-week-summary/tmp/assets/dashboard-overview.png";

const W=1280,H=720;
const C={bg:"#07101F",panel:"#0D1729",panel2:"#111E33",line:"#22314A",white:"#F8FAFC",muted:"#9AA9C0",green:"#00D89C",cyan:"#08BEE8",blue:"#4D8DFF",purple:"#D938F0",red:"#FF5A67",amber:"#F6C453"};
const pres=Presentation.create({slideSize:{width:W,height:H}});

function box(slide,x,y,w,h,fill=C.panel,line=C.line,r="roundRect"){
  const cfg={geometry:r,position:{left:x,top:y,width:w,height:h},fill,line:{style:"solid",fill:line,width:1}};
  if(["rect","textbox","roundRect"].includes(r)) cfg.borderRadius="rounded-xl";
  return slide.shapes.add(cfg);
}
function text(slide,txt,x,y,w,h,size=22,color=C.white,bold=false,align="left"){
  const s=slide.shapes.add({geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:"none",line:{style:"solid",fill:"none",width:0}});
  s.text=txt; s.text.style={fontFamily:"Aptos",fontSize:size,color,bold,alignment:align,verticalAlignment:"middle",wrap:true}; return s;
}
function line(slide,x,y,w,color=C.green,h=3){slide.shapes.add({geometry:"rect",position:{left:x,top:y,width:w,height:h},fill:color,line:{style:"solid",fill:color,width:0}});}
function chrome(slide,n,section){
  slide.background.fill=C.bg;
  text(slide,"PCS • QUALITY ENGINEERING",56,24,380,24,13,C.muted,true);
  text(slide,section.toUpperCase(),860,32,300,24,13,C.muted,true,"right");
  text(slide,String(n).padStart(2,"0"),1190,665,36,22,12,C.muted,true,"right");
}
function title(slide,txt,sub){text(slide,txt,56,70,1168,54,35,C.white,true); line(slide,56,136,94,C.green,4); if(sub)text(slide,sub,166,124,1000,30,16,C.muted,false);}
function pill(slide,label,x,y,w,fill=C.green,color=C.bg){box(slide,x,y,w,30,fill,fill);text(slide,label,x+8,y,w-16,30,13,color,true,"center");}
function bulletList(slide,items,x,y,w,gap=54,size=21,color=C.white){items.forEach((it,i)=>{box(slide,x,y+i*gap,11,11,C.green,C.green,"ellipse");text(slide,it,x+26,y-8+i*gap,w-26,gap,size,color,false);});}
function metric(slide,value,label,x,y,w,accent=C.green){text(slide,value,x,y,w,58,38,accent,true,"center");text(slide,label,x,y+56,w,28,14,C.muted,true,"center");}
function sectionTag(slide,label,x,y){line(slide,x,y,5,C.green,28);text(slide,label,x+16,y-2,420,30,16,C.muted,true);}
function flow(slide,items,x,y,totalW){const gap=18, w=(totalW-gap*(items.length-1))/items.length; items.forEach((it,i)=>{if(i<items.length-1)line(slide,x+i*(w+gap)+w,y+37,gap,C.line,2);box(slide,x+i*(w+gap),y,w,76,C.panel2,C.line);text(slide,String(i+1).padStart(2,"0"),x+i*(w+gap)+12,y+9,34,20,12,C.green,true);text(slide,it,x+i*(w+gap)+12,y+28,w-24,38,15,C.white,true,"center");});}

// 1
{
 const s=pres.slides.add(); chrome(s,1,"Báo cáo tổng kết 10 tuần");
 text(s,"DỰ ÁN KIỂM THỬ HỆ THỐNG",70,92,720,38,18,C.green,true);
 text(s,"Pickleball Court & Coach\nBooking System",70,142,820,150,52,C.white,true);
 text(s,"Báo cáo hoạt động kiểm thử & tự động hóa\n10 tuần đồng hành cùng AI",74,306,670,72,24,C.muted,false);
 line(s,74,404,260,C.cyan,5);
 text(s,"NHÓM 3 • SWP391_SE1701",74,430,520,32,18,C.white,true);
 text(s,"Đại học FPT TP.HCM",74,465,480,28,16,C.muted);
 box(s,800,124,384,408,C.panel,C.line);
 sectionTag(s,"CORE TEAM",830,154);
 const members=[["Trần Quốc Sang","PM / Tester 2"],["Lê Thị Văn Anh","QA Leader"],["Trương Quang Tuân","Tester 1"],["Nguyễn Đào Văn Quý","Backend Developer"],["Lê Hữu Sơn","Frontend Developer"]];
 members.forEach((m,i)=>{text(s,m[0],830,205+i*59,220,26,18,C.white,true);text(s,m[1],830,232+i*59,250,20,14,i===1?C.green:C.muted);});
 pill(s,"QUALITY • AUTOMATION • TRACEABILITY",800,558,384,C.cyan,C.bg);
}

// 2
{
 const s=pres.slides.add();chrome(s,2,"Chức năng được kiểm thử");title(s,"5 nghiệp vụ cốt lõi tạo nên trải nghiệm PCS","Mỗi module được gắn với rủi ro nghiệp vụ và lớp kiểm thử phù hợp");
 const features=[["AUTHENTICATION","Đăng ký • đăng nhập • OAuth2 • phân quyền",C.green],["BOOKING & SCHEDULING","Chọn sân • giữ slot 10 phút • overlap check",C.cyan],["PAYMENT","QR PayOS • webhook IPN • trạng thái đơn",C.blue],["PROMOTION","Voucher • min order • ngày hết hạn",C.purple],["REVIEW & RATING","Đánh giá sân và HLV sau buổi chơi",C.amber]];
 features.forEach((f,i)=>{const y=174+i*88;line(s,56,y,6,f[2],66);text(s,String(i+1).padStart(2,"0"),80,y,38,24,13,f[2],true);text(s,f[0],130,y-2,290,30,19,C.white,true);text(s,f[1],440,y-1,730,40,18,C.muted);});
 box(s,56,626,1168,32,C.panel2,C.line);text(s,"Phạm vi chức năng → kịch bản kiểm thử → bằng chứng chất lượng",76,627,1128,28,16,C.green,true,"center");
}

// 3
{
 const s=pres.slides.add();chrome(s,3,"Test Plan & Criteria");title(s,"ISTQB v4.0 định nghĩa rõ khi nào được bắt đầu và kết thúc","Các tiêu chí biến kế hoạch kiểm thử thành một quality gate có thể đo lường");
 box(s,56,180,544,382,C.panel,C.line);sectionTag(s,"ENTRY CRITERIA",82,206);
 bulletList(s,["API Route Handlers có cấu trúc logic cơ bản","Vitest và JSDOM đã cấu hình","Mock data tập trung đã sẵn sàng"],88,282,470,78,20);
 box(s,640,180,584,382,C.panel2,C.line);sectionTag(s,"EXIT CRITERIA",666,206);
 const exits=[["100%","Test cases được thực thi và pass",C.green],[">90%","Code coverage mục tiêu",C.cyan],["0","Critical / High defect mở",C.red]];
 exits.forEach((e,i)=>{metric(s,e[0],e[1],678,272+i*84,500,e[2]);});
 pill(s,"TEST_PLAN.md",486,604,308,C.blue,C.white);
}

// 4
{
 const s=pres.slides.add();chrome(s,4,"Scope & Deliverables");title(s,"Phạm vi gọn, sản phẩm bàn giao đầy đủ và có thể truy vết","Nhóm ưu tiên chiều sâu automation thay vì mở rộng sang hạ tầng");
 text(s,"IN SCOPE",56,174,260,28,18,C.green,true);line(s,56,210,520,C.green,3);
 bulletList(s,["Unit Test cho service logic","API Integration Test cho endpoints","UI Component Test cho LoginPage"],66,250,500,70,20);
 text(s,"OUT OF SCOPE",646,174,300,28,18,C.red,true);line(s,646,210,578,C.red,3);
 bulletList(s,["Load / Stress testing","Network penetration testing","Tài khoản ngân hàng thật"],656,250,540,70,20);
 sectionTag(s,"DELIVERABLES",56,496);
 const docs=[["TEST_PLAN.md","Kế hoạch"],["53 automated tests","Mã kiểm thử"],["Postman Collection","API assets"],["Defect + Summary","Báo cáo"]];
 docs.forEach((d,i)=>{const x=56+i*294;box(s,x,542,268,80,C.panel,C.line);text(s,d[0],x+16,554,236,28,17,[C.green,C.cyan,C.purple,C.blue][i],true,"center");text(s,d[1],x+16,584,236,22,14,C.muted,false,"center");});
}

// 5
{
 const s=pres.slides.add();chrome(s,5,"Test Data Management");title(s,"Một nguồn dữ liệu tập trung giúp test độc lập và dễ bảo trì","tests/data/testData.ts kiểm soát positive, negative và cleanup state");
 box(s,56,176,350,390,C.panel,C.line);text(s,"testData.ts",86,202,290,38,26,C.green,true);text(s,"SINGLE SOURCE OF TRUTH",86,250,290,22,13,C.muted,true);line(s,86,294,140,C.green,4);
 text(s,"Accounts\nCourts\nTime slots\nVoucher codes\nWebhook payloads",86,326,250,174,20,C.white,true);
 box(s,446,176,360,390,C.panel2,C.line);sectionTag(s,"POSITIVE",470,202);bulletList(s,["Đăng ký đúng định dạng","PayOS signature hợp lệ","Booking ở slot trống"],478,280,292,70,18);
 box(s,846,176,378,390,"#211720",C.line);sectionTag(s,"NEGATIVE",870,202);bulletList(s,["Email sai / password yếu","Webhook sai signature","Overlap / vượt 3 đơn"],878,280,310,70,18);
 box(s,56,598,1168,48,"#0B2830",C.green);text(s,"vi.clearAllMocks() sau mỗi test → không ảnh hưởng chéo",80,605,1120,32,18,C.green,true,"center");
}

// 6
{
 const s=pres.slides.add();chrome(s,6,"Thiết kế hộp đen");title(s,"8 quy tắc bao phủ toàn bộ tổ hợp đăng ký tài khoản","Decision Table biến ba điều kiện đầu vào thành hành vi có thể kiểm chứng");
 const cols=["Điều kiện","R1","R2","R3","R4","R5","R6","R7","R8"], rows=[["Email hợp lệ & duy nhất","Y","Y","Y","Y","N","N","N","N"],["SĐT hợp lệ & duy nhất","Y","Y","N","N","Y","Y","N","N"],["Mật khẩu mạnh","Y","N","Y","N","Y","N","Y","N"],["Kết quả","OK","Pass","Phone","Both","Email","Both","Both","All"]];
 const x=56,y=188,cw=[310,94,94,94,94,94,94,94,94],rh=68;let xx=x;
 cols.forEach((v,i)=>{box(s,xx,y,cw[i],50,C.panel2,C.line,"rect");text(s,v,xx+6,y+6,cw[i]-12,38,15,i?C.muted:C.white,true,"center");xx+=cw[i];});
 rows.forEach((r,ri)=>{xx=x;r.forEach((v,i)=>{box(s,xx,y+50+ri*rh,cw[i],rh,ri===3?"#0D2630":C.panel,C.line,"rect");text(s,v,xx+8,y+58+ri*rh,cw[i]-16,rh-16,i?17:16,ri===3?C.green:C.white,ri===3||i===0,"center");xx+=cw[i];});});
 box(s,56,538,1168,86,C.panel2,C.line);metric(s,"8","TEST CASES",82,548,180,C.green);text(s,"TC_DT_01 → TC_DT_08",288,560,350,34,24,C.white,true);text(s,"Phát hiện lỗi nhập liệu đồng thời thay vì chỉ kiểm tra từng trường riêng lẻ",662,548,518,54,18,C.muted);
}

// 7
{
 const s=pres.slides.add();chrome(s,7,"Thiết kế Use Case");title(s,"UC-04 khóa chặt hành trình Đặt sân → Thanh toán → Xác nhận","Luồng cơ bản và ba ngoại lệ xác định rõ trạng thái của slot");
 flow(s,["Chọn sân\n& khung giờ","Giữ slot\n10 phút","Quét QR\nPayOS","Webhook\nIPN","Đơn Paid\nKhóa slot"],56,184,1168);
 text(s,"3 luồng ngoại lệ quyết định độ bền của hệ thống",56,310,700,34,24,C.white,true);
 const af=[["AF1","Trùng giờ chơi","Từ chối khi slot đã bị khóa",C.red],["AF2","Vượt giới hạn","Chặn đơn thứ 4 trong ngày",C.amber],["AF3","Hủy / hết hạn","Giải phóng slot sau 10 phút",C.cyan]];
 af.forEach((a,i)=>{const y=366+i*82;line(s,56,y,5,a[3],58);text(s,a[0],80,y,62,30,18,a[3],true);text(s,a[1],150,y,230,30,20,C.white,true);text(s,a[2],402,y,520,42,18,C.muted);});
 box(s,960,344,240,220,C.panel2,C.line);metric(s,"4","USE CASE TCs",980,370,200,C.green);text(s,"TC_UC_01\n→\nTC_UC_04",1000,466,160,82,22,C.white,true,"center");
}

// 8
{
 const s=pres.slides.add();chrome(s,8,"White-box & BVA");title(s,"Các biên nghiệp vụ được chuyển thành điểm kiểm thử cụ thể","Không chỉ phủ dòng lệnh — nhóm kiểm tra đúng nơi hành vi thay đổi");
 const blocks=[
  ["calculateRefundAmount()","HOÀN TIỀN","< 2h: 0%","2–12h: 70%","> 12h: 100%",C.cyan],
  ["createBooking()","GIỚI HẠN ĐẶT","Lượt 3: Pass","Lượt 4: Block","Ranh giới/ngày",C.green],
  ["validatePromotion()","VOUCHER","Hết hạn T/F","Min order T/F","Phủ nhánh if/else",C.purple]
 ];
 blocks.forEach((b,i)=>{const x=56+i*390;box(s,x,188,360,350,C.panel,C.line);text(s,b[1],x+24,214,312,24,14,b[5],true);text(s,b[0],x+24,250,312,58,23,C.white,true);line(s,x+24,322,80,b[5],4);[b[2],b[3],b[4]].forEach((z,j)=>{text(s,String(j+1).padStart(2,"0"),x+24,352+j*55,48,25,13,b[5],true);text(s,z,x+72,346+j*55,252,38,18,C.muted);});});
 text(s,"KỸ THUẬT",56,580,120,24,13,C.muted,true);pill(s,"EP",184,574,72,C.blue,C.white);pill(s,"BVA",268,574,82,C.cyan,C.bg);pill(s,"STATEMENT",362,574,126,C.green,C.bg);pill(s,"BRANCH",500,574,108,C.purple,C.white);
}

// 9
{
 const s=pres.slides.add();chrome(s,9,"API Testing with Postman");title(s,"Postman kiểm chứng contract HTTP trước khi đi sâu vào automation","Collection tự lưu JWT và assert đồng thời status code lẫn response schema");
 box(s,56,176,436,392,C.panel,C.line);sectionTag(s,"ENVIRONMENT",82,204);
 text(s,"baseUrl",86,270,120,26,16,C.cyan,true);text(s,"http://localhost:3000",218,270,232,26,17,C.white,true);
 text(s,"jwt_token",86,322,120,26,16,C.green,true);text(s,"Auto-save after login",218,322,232,26,17,C.muted);
 line(s,86,380,350,C.line,2);text(s,"COLLECTION FLOW",86,404,230,24,13,C.muted,true);
 flow(s,["Register","Login","Save JWT"],86,448,350);
 box(s,532,176,692,392,C.panel2,C.line);sectionTag(s,"POSTMAN TEST SCRIPT",558,204);
 text(s,'pm.test("Status code is 200/201", () => {\n  pm.expect(pm.response.code)\n    .to.be.oneOf([200, 201]);\n});\n\npm.test("Response contains token", () => {\n  pm.expect(pm.response.json())\n    .to.have.property("token");\n});',568,266,626,238,18,C.white,false);
 pill(s,"PCS.postman_collection.json",656,594,474,C.cyan,C.bg);
}

// 10
{
 const s=pres.slides.add();chrome(s,10,"Automation stack");title(s,"Vitest tạo một workspace kiểm thử nhanh, thống nhất và dễ bảo trì","Backend chạy Node, UI chạy JSDOM, dữ liệu dùng chung qua testData.ts");
 box(s,56,184,430,366,C.panel,C.line);text(s,"VITEST",86,214,230,42,28,C.green,true);text(s,"Lý do lựa chọn",86,270,260,28,18,C.white,true);
 bulletList(s,["TypeScript & Next.js không cần Babel phức tạp","Chạy song song nhiều suite","Mock API, repository và dependency linh hoạt","Coverage V8 tích hợp trực tiếp"],90,324,350,58,18);
 box(s,532,184,692,366,C.panel2,C.line);sectionTag(s,"WORKSPACE ARCHITECTURE",562,214);
 flow(s,["vitest.config.ts","Backend\nNode","Frontend\nJSDOM","Coverage\nV8"],562,278,632);
 line(s,594,404,568,C.line,2);pill(s,"tests/data/testData.ts",690,430,368,C.cyan,C.bg);text(s,"Mock accounts • courts • slots • vouchers",658,478,432,30,17,C.muted,false,"center");
 box(s,56,580,1168,50,"#0B2830",C.green);text(s,"Một nguồn dữ liệu kiểm thử → ít trùng lặp → thay đổi schema nhanh hơn",80,588,1120,34,18,C.green,true,"center");
}

// 11
{
 const s=pres.slides.add();chrome(s,11,"Code Coverage with Istanbul");title(s,"Coverage chứng minh bộ test đã đi qua các nhánh logic trọng yếu","Istanbul v8 xuất đồng thời số liệu tổng quan và báo cáo HTML theo từng dòng code");
 const ms=[["53","TOTAL TESTS",C.white],["53","PASSED",C.green],["0","FAILED",C.red],["100%","PASS RATE",C.green],["4.22s","LOCAL RUN",C.cyan]];
 ms.forEach((m,i)=>{const x=56+i*232;box(s,x,176,208,116,C.panel,C.line);metric(s,m[0],m[1],x+12,190,184,m[2]);});
 sectionTag(s,"TEST SUITE ALLOCATION",56,338);
 const bars=[["Unit Tests",41,53,C.green],["API Integration",9,53,C.cyan],["UI Component",3,53,C.purple]];
 bars.forEach((b,i)=>{const y=390+i*67;text(s,b[0],56,y,210,26,17,C.white,true);text(s,`${b[1]} TCs`,1050,y,150,26,16,C.white,true,"right");line(s,278,y+8,746,C.line,12);line(s,278,y+8,746*b[1]/b[2],b[3],12);});
 box(s,56,600,1168,46,C.panel2,C.line);text(s,"Statements 92.5%",90,607,250,28,17,C.green,true);text(s,"Branches 88.3%",370,607,250,28,17,C.cyan,true);text(s,"Functions 95.0%",650,607,250,28,17,C.purple,true);text(s,"Lines 92.5%",930,607,240,28,17,C.blue,true);
}

// 12
{
 const s=pres.slides.add();chrome(s,12,"QA Dashboard");title(s,"Dashboard biến kết quả kiểm thử thành bằng chứng có thể đọc ngay","Một màn hình kết nối pass rate, phân bổ suite và trạng thái pipeline");
 const bytes=await fs.readFile(DASH);s.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:"image/png",alt:"PCS QA Dashboard overview showing 53 passed tests and pipeline status",fit:"contain",position:{left:56,top:170,width:820,height:462},geometry:"roundRect",borderRadius:"rounded-xl"});
 line(s,910,184,5,C.green,38);text(s,"OVERVIEW PORTAL",930,184,270,30,17,C.muted,true);
 bulletList(s,["53 Passed / 0 Failed","100% automation","Phân bổ Unit • API • UI","Pipeline 7 bước trực quan","Coverage theo 4 chỉ số"],918,252,290,61,19);
 box(s,910,560,294,70,"#0B2830",C.green);text(s,"Evidence → quyết định",930,575,254,38,18,C.green,true,"center");
}

// 13
{
 const s=pres.slides.add();chrome(s,13,"Dashboard vận hành");title(s,"Test Execution và Defect Center rút ngắn vòng phản hồi QA–Dev","Mỗi kết quả đều có thể lọc, truy vết và mở chi tiết xử lý");
 sectionTag(s,"TEST EXECUTION GRID",56,174);text(s,"Search • Filter • Pagination • Priority • Status",76,214,530,34,18,C.muted);
 const rows=[["TC_PAY_01","Payment","High","PASS"],["TC_BOOK_04","Booking","High","PASS"],["TC_REG_03","Auth","Medium","PASS"],["TC_UI_02","Login UI","Low","PASS"]];
 const y=264;["ID","MODULE","PRIORITY","STATUS"].forEach((h,i)=>text(s,h,66+i*145,y,140,28,14,C.muted,true));
 rows.forEach((r,ri)=>{box(s,56,y+38+ri*50,574,42,ri%2?C.panel2:C.panel,C.line,"rect");r.forEach((v,i)=>text(s,v,66+i*145,y+42+ri*50,140,34,15,i===3?C.green:C.white,i===3));});
 sectionTag(s,"DEFECT DETAIL",680,174);box(s,680,216,544,302,C.panel,C.line);
 pill(s,"HIGH",704,238,78,C.red,C.white);text(s,"DF_PAY_01",800,238,170,30,20,C.white,true);text(s,"Timezone drift in refund calculation",704,284,470,34,21,C.white,true);
 text(s,"STEPS TO REPRODUCE",704,338,240,24,13,C.muted,true);text(s,"1. Create booking near boundary\n2. Cancel using local timezone\n3. Compare expected refund",704,366,470,86,17,C.white);
 line(s,704,466,470,C.line,2);text(s,"SUGGESTED FIX",704,480,180,22,13,C.green,true);text(s,"Normalize timezone or inject controlled clock",874,476,300,34,16,C.muted);
 box(s,56,566,1168,62,"#0D2630",C.green);text(s,"Chi tiết đủ ngữ cảnh giúp Dev tái hiện và sửa lỗi ngay trong một vòng",80,578,1120,36,18,C.green,true,"center");
}

// 14
{
 const s=pres.slides.add();chrome(s,14,"Truy vết & xu hướng");title(s,"Traceability nối yêu cầu với test — trend chứng minh chất lượng cải thiện","Dashboard trả lời đồng thời: đã kiểm gì, ở đâu và thay đổi ra sao");
 box(s,56,174,552,342,C.panel,C.line);sectionTag(s,"REQUIREMENT TRACEABILITY",80,198);
 const map=[["UC-01","TC_USR_01","tests/unit/user.test.ts"],["UC-04","TC_PAY_01","tests/api/payment.api.test.ts"],["FR-12","TC_BOOK_04","tests/unit/booking.test.ts"]];
 map.forEach((r,i)=>{const y=258+i*70;pill(s,r[0],80,y,78,C.blue,C.white);text(s,r[1],178,y,132,30,17,C.white,true);text(s,r[2],330,y,250,30,15,C.muted);});
 box(s,648,174,576,342,C.panel2,C.line);sectionTag(s,"TREND ANALYTICS",672,198);
 // chart axes and trend
 line(s,694,456,470,C.line,2);line(s,694,278,2,C.line,178);
 const pts=[[712,424],[802,390],[892,360],[982,320],[1072,294],[1152,278]];
 for(let i=0;i<pts.length-1;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1];const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);const ln=s.shapes.add({geometry:"rect",position:{left:x1,top:y1,width:len,height:4},fill:C.green,line:{style:"solid",fill:C.green,width:0}});ln.rotation=Math.atan2(dy,dx)*180/Math.PI;}
 pts.forEach((p,i)=>{box(s,p[0]-6,p[1]-6,12,12,C.green,C.green,"ellipse");text(s,`R${i+1}`,p[0]-15,466,30,20,12,C.muted,true,"center");});
 text(s,"PASS RATE / COVERAGE",872,232,220,24,13,C.green,true,"center");
 const feats=[["History Log","Đối soát Run A / B"],["Report Center","Tải báo cáo Markdown"],["Settings","Vitest • Timezone • Mock DB"]];feats.forEach((f,i)=>{const x=56+i*390;line(s,x,560,5,[C.green,C.cyan,C.purple][i],52);text(s,f[0],x+18,552,340,28,18,C.white,true);text(s,f[1],x+18,584,340,28,16,C.muted);});
}

// 15
{
 const s=pres.slides.add();chrome(s,15,"Defect management");title(s,"Ba lỗi được đóng bằng một quy trình retest có kiểm soát","Mỗi defect đi qua cùng một lifecycle và giữ bằng chứng sửa lỗi");
 flow(s,["New","Assigned","In Progress","Fixed","Retest","Closed"],56,174,1168);
 const defs=[["DF_PAY_01","HIGH","Lệch múi giờ hoàn tiền\nUTC vs UTC+7",C.red],["DF_REG_01","MEDIUM","Email hai dấu chấm\nđược Zod chấp nhận",C.amber],["DF_PAY_02","MEDIUM","Webhook thiếu\nsuccess indicator",C.cyan]];
 defs.forEach((d,i)=>{const x=56+i*390;box(s,x,312,360,216,C.panel,C.line);pill(s,d[1],x+24,336,96,d[3],d[1]==="HIGH"?C.white:C.bg);text(s,d[0],x+140,336,170,30,19,C.white,true);text(s,d[2],x+24,392,312,78,20,C.white,true);text(s,"FIXED • RETESTED • CLOSED",x+24,488,312,24,14,C.green,true,"center");});
 box(s,56,572,1168,60,"#0B2830",C.green);metric(s,"100%","DEFECTS CLOSED",74,568,240,C.green);text(s,"Không còn defect Critical/High mở trước khi bàn giao",342,582,830,34,19,C.white,true,"center");
}

// 16
{
 const s=pres.slides.add();chrome(s,16,"Test Summary Report");title(s,"Kết quả cuối cùng đạt toàn bộ quality gate đã cam kết","53 test pass, không còn blocker và các luồng trọng yếu sẵn sàng bàn giao");
 const ms=[["53","TOTAL",C.white],["53","PASSED",C.green],["0","FAILED",C.red],["0","BLOCKED",C.amber],["100%","PASS RATE",C.cyan]];
 ms.forEach((m,i)=>{const x=56+i*232;box(s,x,182,208,118,C.panel,C.line);metric(s,m[0],m[1],x+10,198,188,m[2]);});
 box(s,56,346,1168,204,C.panel2,C.line);sectionTag(s,"RELEASE ASSESSMENT",82,372);
 bulletList(s,["Đăng nhập và phân quyền hoạt động đúng","Đặt sân thời gian thực không phát sinh double-booking","PayOS webhook và trạng thái đơn nhất quán","Hủy lịch và hoàn tiền đúng các mốc nghiệp vụ"],92,430,1080,50,19);
 pill(s,"RELEASE READY",462,622,356,C.green,C.bg);
}

// 17
{
 const s=pres.slides.add();chrome(s,17,"AI Audit");title(s,"AI tăng tốc khởi tạo — nhóm vẫn chịu trách nhiệm kiểm chứng","Prompt engineering hiệu quả khi mọi gợi ý đều được review bằng tài liệu và test");
 const ai=[["ChatGPT","Boilerplate test & NextRequest mocks",C.green],["Claude","Use Case branches & workspace config",C.cyan],["GitHub Copilot","Gợi ý mã trong IDE",C.purple]];
 ai.forEach((a,i)=>{const x=56+i*390;box(s,x,178,360,112,C.panel,C.line);text(s,a[0],x+22,194,316,32,22,a[2],true);text(s,a[1],x+22,232,316,42,16,C.muted);});
 box(s,56,330,544,250,C.panel2,C.line);sectionTag(s,"GIÁ TRỊ",80,354);metric(s,"~50%","BOILERPLATE ĐƯỢC HỖ TRỢ",102,406,450,C.green);text(s,"Tiết kiệm thời gian khởi tạo để tập trung vào logic nghiệp vụ",92,508,472,46,17,C.muted,false,"center");
 box(s,640,330,584,250,"#211720",C.line);sectionTag(s,"AI MISTAKES → HUMAN FIX",664,354);
 bulletList(s,["UTC cứng làm refund test fail ngẫu nhiên → dùng ngày động / clock kiểm soát","Cú pháp RTL cũ → đối chiếu tài liệu v16 và cập nhật test"],676,414,510,76,18);
 text(s,"Nguyên tắc: AI đề xuất • Con người xác minh • Test quyết định",56,614,1168,30,19,C.white,true,"center");
}

// 18
{
 const s=pres.slides.add();chrome(s,18,"Đóng góp thành viên");title(s,"Phân công rõ vai trò, nhưng chất lượng là trách nhiệm chung","Mỗi đóng góp gắn với deliverable và pull request có thể truy vết");
 const people=[
  ["Trần Quốc Sang","PM / Tester 2","Kế hoạch • Decision Table • Use Case","PR #1 • #3",C.blue],
  ["Lê Thị Văn Anh","QA Leader","Vitest/JSDOM • API tests • Dashboard","PR #6 • #7",C.green],
  ["Trương Quang Tuân","Tester 1","Unit Tests • Workspace config","PR #2 • #4",C.cyan],
  ["Nguyễn Đào Văn Quý","Backend Dev","API • Mock DB • Business fixes","PR #5 • #8",C.amber],
  ["Lê Hữu Sơn","Frontend Dev","LoginPage • RTL component logic","PR #9 • #10",C.purple]
 ];
 people.forEach((p,i)=>{const y=168+i*92;line(s,56,y,7,p[4],70);text(s,p[0],82,y,270,30,21,C.white,true);text(s,p[1],82,y+34,270,24,15,p[4],true);text(s,p[2],386,y+4,570,48,18,C.muted);pill(s,p[3],1020,y+16,172,p[4],p[4]===C.amber?C.bg:C.white);});
 box(s,56,628,1168,28,C.panel2,C.line);line(s,56,628,1168,C.green,3);
}

// 19
{
 const s=pres.slides.add();chrome(s,19,"Kết luận & bước tiếp theo");
 text(s,"Nền tảng QA đã sẵn sàng.\nBước tiếp theo là mở rộng chiều sâu kiểm thử.",72,92,1040,118,40,C.white,true);
 line(s,72,232,160,C.green,5);
 const wins=[["53 / 53","AUTOMATED TESTS",C.green],[">92.5%","TARGETED COVERAGE",C.cyan],["100%","DEFECTS CLOSED",C.purple]];
 wins.forEach((w,i)=>{const x=72+i*358;box(s,x,282,326,126,C.panel,C.line);metric(s,w[0],w[1],x+18,298,290,w[2]);});
 text(s,"HƯỚNG PHÁT TRIỂN",72,462,330,28,18,C.muted,true);line(s,72,498,1136,C.line,2);
 text(s,"01",72,524,52,32,18,C.green,true);text(s,"K6 / JMeter",132,520,280,36,23,C.white,true);text(s,"Bổ sung performance gate vào pipeline CI/CD",418,520,760,40,18,C.muted);
 text(s,"02",72,584,52,32,18,C.cyan,true);text(s,"Playwright E2E",132,580,280,36,23,C.white,true);text(s,"Mở rộng sang Chrome, Safari và các hành trình thật",418,580,760,40,18,C.muted);
 pill(s,"READY FOR THE NEXT QUALITY GATE",830,624,330,C.green,C.bg);
}

await fs.mkdir(new URL("file:///C:/Users/Lenovo%20LEGION%205/OneDrive/Desktop/SWT_TESTING/pickleball-booking-system-main/output/"),{recursive:true});
await fs.mkdir(QA,{recursive:true});
for (const [i,s] of pres.slides.items.entries()){
  const png=await pres.export({slide:s,format:"png",scale:1});await fs.writeFile(`${QA}/slide-${String(i+1).padStart(2,"0")}.png`,new Uint8Array(await png.arrayBuffer()));
  const layout=await s.export({format:"layout"});await fs.writeFile(`${QA}/slide-${String(i+1).padStart(2,"0")}.layout.json`,await layout.text());
}
const montage=await pres.export({format:"png",montage:true,scale:0.5});await fs.writeFile(`${QA}/montage.png`,new Uint8Array(await montage.arrayBuffer()));
const pptx=await PresentationFile.exportPptx(pres);await pptx.save(OUT);
console.log(OUT);

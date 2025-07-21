const saveBtn=document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput=document.getElementById("file");
const eraserBtn=document.getElementById("eraser-btn");
const modeBtn=document.getElementById("mode-btn");
const destroyBtn=document.getElementById("destroy-btn");
// Array.form을 사용해 배열로 생성하기.
const colorOptions = Array.from( document.getElementsByClassName("color-option")
); //getElementsByClassName를 getElementByClassName 라고 오타냈더니 실행안됨
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width"); //getElementById : 엘리먼트요소의 ID값이 ( 이거 )인 것을 가져온다.
const canvas = document.querySelector("canvas");
// 캔버스에 그림 그릴 때 사용하는 것이 context 줄여서 ctx
// getContext는 붓을 쥐어주는 강력한 함수
const ctx = canvas.getContext("2d");
// 캔버스사이즈 상수로 만들기
const CANVAS_WIDTH=800;
const CANVAS_HEIGHT=800;



// css에도 네모 그렸는데 JS에서도 그리는이유:
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value; //초기값은 5로 주겠다.
ctx.lineCap="round"
//[ ● Mouse Painting: 마우스로 흑색 그림판 만들기]
let isPainting = false;
let isFilling=false;


//2.함수 정의: 명령어를 만들어 놓는 일, 이벤트 발생 시 실행할 로직 (이벤트 핸들러 함수) , 무엇을 할지
function onMove(e) {
  //마우스를누르고 움직인다면 //event 귀찮아서,걍 e로 씀
  if (isPainting) {
    //만약 isPainting 이 True라면
    //선을 옮겨서
    ctx.lineTo(e.offsetX, e.offsetY);
    //선을 그리고
    ctx.stroke();
    //또는 선을 채우고
    // ctx.fill();
    //함수를 끝낼거임
    return;
  }
  //새로운 path로 시작하도록 설정
  ctx.beginPath();
  //마우스가 있는 곳으로, 조용히 브러시만 움직임
  ctx.moveTo(e.offsetX, e.offsetY); //※여기에 offsent라고 오타가 있어서 이부분 반영 안됬었음
}
function startPainting() {
  //마우스 누르면 그리기 시작 event 매개변수 생략도 가능한게 , 매개변수를 받지 않는 함수라.
  isPainting = true;
}
function cancelPainting(event) {
  //마우스 떼면 그리기 끝
  isPainting = false;
  ctx.beginPath(); //사용자가 페인팅을 마치면 새로운 path를 만들도록 한다.
}
function onLineWidthChange(e) {
  //여기서 매개변수인 e는 우리에게 input의 새로운 value(값)을 알려준다.
  console.log(e.target.value); //타겟 값을 가져온 걸. 로그에 표시하여 확인 ( 꺼두댐 )
  ctx.lineWidth = e.target.value; // 값을 Line에 넣어주기
}
function onColorChange(e) {
  console.log(e.target.value); //콘솔 로그에 표시. 색 바뀐것을 !
  ctx.strokeStyle = e.target.value; //값을 라인 색에 넣기
  ctx.fillStyle = e.target.value; //값을 전체 색상 채우기
}
function onColorClick(e) {
  const colorValue = e.target.dataset.color; //함수 내에 자주 쓰이는거 변수로 생성
  console.dir(e.target.dataset.color); //함수, 어떤 color가 클릭됐는 지 알수있는!
  ctx.strokeStyle = colorValue; //클릭한 값을 라인에 넣기
  ctx.fillStyle = colorValue; //클릭한 값을 필에 넣기
  color.value = colorValue; //사용자에게 선택한 값을 알려주기 위해 추가
}
// 모드변경버튼
function onModeClick(e){ //버튼 글씨 바꾸기.
 if(isFilling){
  isFilling=false;
  modeBtn.innerText="Draw"
 }
 else{
  isFilling=true;
  modeBtn.innerText="Fill"

 }
}
// 캔버스 색채우기 함수
function onCanvasClick(e){
  if(isFilling){
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  }
}
// 파괴버튼
function onDestroyClick(e){
  ctx.fillStyle="white";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

}
// 지우개버튼
function onEraserClick(e){
  ctx.strokeStyle="white";
  isFilling=false;
  modeBtn.innerText="Draw";
}
function onFileChange(e){
  console.dir(e.target); //콘솔에 표시
  const file = e.target.files[0]
  const url=URL.createObjectURL(file)//브라우저 메모리에서 그 파일의 URL얻어오기
  console.log(url);//콘솔에 표시
  const image = new Image() //html에서 이렇게 쓰는 것과 동일 <img src="">
  image.src=url;
  image.onload=function(){
    ctx.drawImage(image,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    fileInput.value=null;
  }
}
function onDoubleClick(e){ //글씨 적고 그림판에 더블클릭하면! 생성 
  const text = textInput.value;
  if(text!=="")
  {
    ctx.save(); //🍎save 와 restore 사이에는 어떤 수정을 해도 저장되지 않는다. 
    ctx.lineWidth=1;
    ctx.font="68px serif";
    //외각선글씨
    ctx.strokeText(text,e.offsetX,e.offsetY); //텍스트 관련함수는 . 찍고 text검색하면 fillText랑 strokeText나오는데 하나씩 해보면 됨 .
    //그냥글씨
    ctx.fillText(text,e.offsetX,e.offsetY); //텍스트 관련함수는 . 찍고 text검색하면 fillText랑 strokeText나오는데 하나씩 해보면 됨 .
    console.log(e.offsetX,e.offsetY,text); //offsetX,offsetY는 마우스가 클릭한 canvas 내부 좌표
    ctx.restore(); //여기서 이전 저장된 상태로 돌아감 
  }
  else {
    alert("글씨를 입력하세용! ✏️")
  }
}
function onSaveClick(e){
  console.log(canvas.toDataURL()); //확인용: 이미지를 URL로 인코딩 한 것을 console로 출력.
  const url = canvas.toDataURL(); //url이란 상수를 만들어 아까그 콘솔에 출련된 긴~~url저장
  const a=document.createElement("a") // 1. a태그를 생성해 가짜 링크를 만든담에 
  a.href=url //2. 링크의 href는 그림의 URL로 (아까 엄청 긴거.)
  a.download="myDrawing.png" //3. 파일명을 이렇게 저장시켜준다. 
  a.click();//4. 마지막으로 링크클릭하면 파일 다운로드

}




// 1.이벤트 연결: 그 명령어를 나중에 실행하게 예약하는 일 , 사용자의 행동(이벤트)에 반응하도록 연결  , 언제 할지
//참고로 canvas.addEventListener("mousemove", onMove()); -> 괄호 붙이면 지금 실행됨 일케쓰면 (X)
//이걸 함수 정의보다 자중에 쓰는 이유는,onMove라는 함수가 뭔지 아직 모릅니다., 상태기 때문
//기본문법: 요소.addEventListener("이벤트이름", 실행할함수);
canvas.onmousemove=function(){

}
canvas.addEventListener("dblclick",onDoubleClick); //dblclick같은 정해진 함수는 어떻게 알 수 있지?? 강사보니까 뭐 누르니깐 아래 뜨던데
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting); //마우스가 떠났을 때도 캔슬페인팅으로 간주
canvas.addEventListener("click",onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

// console.log(colorOptions); //컬러 팔렛트 콘솔에 띄웅기
colorOptions.forEach((color) => color.addEventListener("click", onColorClick)); //이벤트리스너 .. 누가 함수를 클릭하면 실행하도록 예약.

modeBtn.addEventListener("click",onModeClick);
destroyBtn.addEventListener("click",onDestroyClick);
eraserBtn.addEventListener("click",onEraserClick);
fileInput.addEventListener("change",onFileChange);
save.addEventListener("click",onSaveClick);



/*
// [ ● Painting Board 만들기 ]
//3. 라인 두께
ctx.lineWidth=2;
//5. 모서리에서 시작되도록
ctx.moveTo(0,0);

const colors = [
    "#c56cf0",
    "#ffb8b8",
    "#ff3838",
    "#ff9f1a",
    "#ff9f1a",
    "#fff200",
    "#32ff7e",
    "#7efff5",
    "#18dcff",
    "#7d5fff",
    "#4b4b4b",
    "#27ae60"
]
//2.event를 console.log
function onClick(event){
    //9.매번 새 path만들어서 기존선 색이 알록달록 그대로 있게
    ctx.beginPath();
    ctx.moveTo(400,400);
    //7.컬러 호출
    const color = colors[Math.floor(Math.random()*colors.length)];
    //8. ctx 스타일 바꿔주기
    ctx.strokeStyle=color;
    //4-2. 선그리기
    ctx.lineTo(event.offsetX, event.offsetY);
    //4. 선 호출
    ctx.stroke()
}

// 1. addEventListener -> canvas.addEventListener("click",onClick): 클릭을 listen하기 위함
// 기본문법: 요소.addEventListener("이벤트이름", 실행할함수);
canvas.addEventListener("mousemove",onClick) //쩐다




// [ ● 빠르게 네모 만들어보기 ]

// fillRect은 사실 단축함수이다. 실제는 선먼저그리고 그담에 fill할지 stroke 할지 결정하는데 그걸 뭉쳐서 만든것
ctx.fillRect(10,50,100,500);
ctx.rect(400,50,100,100);
ctx.rect(410,60,100,100);
ctx.rect(420,70,100,100);
ctx.stroke();

// beginPath 로 위에껏들과 경로끊어주기
ctx.beginPath();
ctx.rect(450,100,100,100);
ctx.rect(550,200,50,50);
ctx.fillStyle="red";
setTimeout(()=>{ctx.fill();},2000)


// [ ● 한단계 한단계 네모 만들어보기 ]

ctx.moveTo(50,50);
ctx.lineTo(150,50);
ctx.lineTo(150,150);
ctx.lineTo(50,150);
ctx.lineTo(50,50);
ctx.stroke();


// [ ● 집 만들기 ]
ctx.fillRect(200,200,50,200);
ctx.fillRect(400,200,50,200);
ctx.lineWidth = 2;
ctx.strokeRect(300,300,50,100);
ctx.fillRect(200,200,200,20);
ctx.moveTo(200,200);
ctx.lineTo(325,150);
ctx.lineTo(450,200);
ctx.fill();


// [ ● 사람 만들기 ]
ctx.fillRect(210,200-109,15,100);
ctx.fillRect(350,200-109,15,100);
ctx.fillRect(260,200-109,60,150);

ctx.arc(290, 50, 40, 0, 2*Math.PI);
ctx.fill();

ctx.beginPath();
ctx.fillStyle = "white"
ctx.arc(270, 50, 8, Math.PI, 2*Math.PI);
ctx.arc(300, 50, 8, Math.PI, 2*Math.PI);
ctx.fill();
*/

import{useEffect,useRef,useState}from"react";
const GAMES=[{id:"draw",icon:"🎯",title:"번호·이름 뽑기",desc:"도착한 사람이 이름을 터치해 자리를 뽑아요"},{id:"roulette",icon:"🎡",title:"룰렛 돌리기",desc:"참가자 전원이 함께하는 행운의 룰렛"},{id:"team",icon:"👥",title:"팀 자동 나누기",desc:"인원을 원하는 팀 수로 공정하게 배정"},{id:"mission",icon:"🎲",title:"랜덤 미션",desc:"재미있는 미션을 무작위로 선택"},{id:"ladder",icon:"🪜",title:"사다리타기",desc:"이름을 선택해 숨은 결과를 확인"}];
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
export default function App(){
 const saved=()=>{try{return JSON.parse(localStorage.getItem("lucky-play-state-v4"))||{}}catch{return{}}};
 const init=saved();const[game,setGame]=useState("home"),[text,setText]=useState(init.text||""),[names,setNames]=useState((init.names||[]).slice(0,100)),[genders,setGenders]=useState(init.genders||{}),[seats,setSeats]=useState(Math.min(100,init.seats??0)),[blanks,setBlanks]=useState(init.blanks??2),[results,setResults]=useState(init.results||[]);
 useEffect(()=>localStorage.setItem("lucky-play-state-v4",JSON.stringify({text,names,genders,seats,blanks,results})),[text,names,genders,seats,blanks,results]);
 const register=()=>{const parsed=[...new Set(text.split(/[\n,]+/).map(v=>v.trim()).filter(Boolean))];if(!parsed.length)return alert("이름을 입력해주세요.");if(parsed.length>100)return alert(`입력한 이름이 ${parsed.length}명입니다. 최대 100명까지만 등록할 수 있습니다.`);const total=Number(seats)||0;if(total<1)return alert("전체 자리 수를 먼저 입력해주세요.");if(parsed.length>total){const diff=parsed.length-total;return alert(`입력한 이름이 전체 자리 수보다 ${diff}명 많습니다.\n전체 자리 수를 조정해주세요.`)}if(parsed.length<total){const diff=total-parsed.length;return alert(`입력한 이름이 전체 자리 수보다 ${diff}명 모자랍니다.\n이름을 추가하거나 전체 자리 수를 조정해주세요.`)}setNames(parsed);setGenders(prev=>Object.fromEntries(parsed.map(n=>[n,prev[n]||"none"])));setResults([]);alert(`${parsed.length}명 등록 완료! 전체 자리 수와 일치합니다.`)};
 return <main><div className="glow g1"/><div className="glow g2"/><header className="top"><button className="brand" onClick={()=>setGame("home")}>LUCKY <b>PLAY</b></button><button className="roster" onClick={()=>setGame("roster")}>👥 모임장 명단관리</button></header><div className="wrap">
  {game==="home"?<Home choose={setGame}/>:<><button className="back" onClick={()=>setGame("home")}>← 게임 선택으로</button>{game==="roster"?<Roster {...{text,setText,names,genders,setGenders,seats,setSeats,register}}/>:game==="draw"?<Draw {...{names,seats,setSeats,blanks,setBlanks,results,setResults}} openRoster={()=>setGame("roster")}/>:game==="roulette"?<Roulette names={names} openRoster={()=>setGame("roster")}/>:game==="team"?<Teams names={names} genders={genders} openRoster={()=>setGame("roster")}/>:game==="mission"?<Mission names={names} openRoster={()=>setGame("roster")}/>:<Ladder names={names} openRoster={()=>setGame("roster")}/>}</>}
 </div><footer><b>LUCKY PLAY</b><span>원작자_단감 · 성능최적화_대명</span></footer></main>}
function Home({choose}){return <><section className="hero"><span>PLAY TOGETHER</span><h1>오늘은 뭐 하고 <em>놀까요?</em></h1><p>참가자 명단은 한 번만 입력하세요. 모든 게임에서 함께 사용됩니다.</p><div className="credit">원작자_단감 <i/> 성능최적화_대명</div><button onClick={()=>choose("roster")}>👥 모임장 명단관리</button></section><section className="cards">{GAMES.map((g,i)=><button key={g.id} onClick={()=>choose(g.id)} style={{"--delay":`${i*.05}s`}}><i>{g.icon}</i><span><b>{g.title}</b><small>{g.desc}</small></span><strong>→</strong></button>)}</section></>}
function Roster({text,setText,names,genders,setGenders,seats,setSeats,register}){
 const draft=[...new Set(text.split(/[\n,]+/).map(v=>v.trim()).filter(Boolean))].length,total=Number(seats)||0,diff=draft-total;
 const setGender=(name,value)=>setGenders(v=>({...v,[name]:value}));
 return <Game title="모임장 명단관리" sub="이름을 등록하고 필요할 때만 성별을 선택하세요" icon="👥"><section className="rosterPage">
  <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="이름을 입력하세요"/>
  <div className={`countCheck ${!draft&&!total?"idle":diff===0?"match":diff>0?"over":"short"}`}><span>입력 이름 <b>{draft}명</b></span><i>↔</i><span>전체 자리 <b>{total}명</b></span><strong>{!draft&&!total?"자리 수와 이름을 입력해주세요":diff===0?"✓ 인원수가 정확히 일치합니다":diff>0?`이름이 ${diff}명 많습니다`:`이름이 ${Math.abs(diff)}명 모자랍니다`}</strong></div>
  <label>전체 자리 수<input type="number" min="0" max="100" value={seats} onChange={e=>setSeats(e.target.value===""?"":Math.min(100,+e.target.value))} onBlur={()=>setSeats(v=>v===""||Number(v)<0?0:Math.min(100,Number(v)))}/></label>
  <button className="primary" onClick={register}>명단 등록 · 갱신</button>
  {!!names.length&&<div className="genderManager"><div className="genderHead"><b>팀 균형용 성별 설정</b><small>선택사항입니다. 선택하지 않으면 팀 나누기에서 일반 참가자로 배정됩니다.</small></div>{names.map(n=><div className="genderRow" key={n}><strong>{n}</strong><div className="genderSeg"><button className={(genders[n]||"none")==="male"?"on":""} onClick={()=>setGender(n,"male")}>남성</button><button className={genders[n]==="female"?"on":""} onClick={()=>setGender(n,"female")}>여성</button><button className={(genders[n]||"none")==="none"?"on none":""} onClick={()=>setGender(n,"none")}>선택 안 함</button></div></div>)}</div>}
  <p>✓ 성별 선택은 선택사항이며, ‘남녀 균형’ 팀 배정에만 사용됩니다.</p>
 </section></Game>
}
function Need({openRoster}){return <div className="need"><span>👥</span><h3>참가자 명단이 필요해요</h3><button className="primary" onClick={openRoster}>명단 등록하기</button></div>}
function Draw({names,seats,setSeats,blanks,setBlanks,results,setResults,openRoster}){
 const[mode,setMode]=useState("touch"),[queue,setQueue]=useState(names),[rolling,setRolling]=useState("?"),[who,setWho]=useState(null),[started,setStarted]=useState(false),[countdown,setCountdown]=useState(null),[popup,setPopup]=useState(null);
 useEffect(()=>setQueue(names),[names]);
 const done=new Set(results.map(r=>r.name)),used=new Set(results.filter(r=>!r.blank).map(r=>r.seat)),waiting=names.filter(n=>!done.has(n)),current=queue.find(n=>!done.has(n));
 const safeSeats=Number(seats)||0,safeBlanks=Number(blanks)||0,pickedBlanks=results.filter(r=>r.blank).length,remain=Math.max(0,safeSeats-results.length),remainBlanks=Math.max(0,safeBlanks-pickedBlanks),winCount=Math.max(0,safeSeats-safeBlanks),availableNumbers=Array.from({length:winCount},(_,i)=>i+1).filter(n=>!used.has(n));
 const start=()=>{if(!names.length)return openRoster();setResults([]);setPopup(null);setCountdown("3");let step=3;const t=setInterval(()=>{step--;if(step>0)setCountdown(String(step));else if(step===0)setCountdown("START!");else{clearInterval(t);setCountdown(null);setStarted(true)}},420)};
 const draw=name=>{if(who||remain<=0)return;setWho(name);setPopup(null);let x=0;const t=setInterval(()=>{setRolling(Math.random()<.28?"꽝":String(availableNumbers[Math.floor(Math.random()*Math.max(1,availableNumbers.length))]||"?"));if(++x>=15){clearInterval(t);const pool=[...availableNumbers,...Array(remainBlanks).fill("blank")];const outcome=pool[Math.floor(Math.random()*pool.length)];const result={name,blank:outcome==="blank",seat:outcome==="blank"?null:outcome};setRolling(result.blank?"꽝":String(result.seat));setResults(v=>[...v,result]);setWho(null);setPopup(result);setTimeout(()=>setPopup(null),2300)}},50)};
 const skip=()=>setQueue(q=>{const a=q.filter(n=>!done.has(n));return a.length<2?q:[...a.slice(1),a[0],...q.filter(n=>done.has(n))]});
 const restart=()=>{setStarted(false);setResults([]);setRolling("?");setPopup(null)};
 return <Game title="번호·이름 뽑기" sub="도착한 사람이 터치 · 꽝과 번호를 중복 없이 추첨" icon="🎯">
  {!names.length?<Need openRoster={openRoster}/>:!started?<section className="drawSetup"><h2>기본 설정</h2><div><label>전체 뽑기 수<input type="number" min={names.length} max="100" value={seats} onChange={e=>setSeats(e.target.value===""?"":Math.min(100,+e.target.value))} onBlur={()=>setSeats(v=>v===""||Number(v)<names.length?names.length:Math.min(100,Number(v)))}/></label><label>꽝 개수<input type="number" min="0" max={Math.max(0,safeSeats-1)} value={blanks} onChange={e=>setBlanks(e.target.value===""?"":Math.min(99,+e.target.value))} onBlur={()=>setBlanks(v=>v===""?0:Math.min(Math.max(0,Number(v)),Math.max(0,safeSeats-1)))}/></label></div><aside><b>{names.length}명</b> 등록 · 최대 <b>100명</b> · 번호는 <b>1~{winCount}</b>까지 나옵니다.</aside><button className="startBtn" onClick={start}>게임 시작! <span>→</span></button></section>:<>
   <div className="drawStats"><span><b>{remain}</b><small>남은 수</small></span><span><b>{results.length}</b><small>뽑은 수</small></span><span><b>{remainBlanks}</b><small>남은 꽝</small></span></div>
   <div className="seg"><button className={mode==="touch"?"on":""} onClick={()=>setMode("touch")}>내 이름 터치</button><button className={mode==="queue"?"on":""} onClick={()=>setMode("queue")}>순서대로 진행</button></div>
   <div className="nextLine">다음 차례: <b>{mode==="queue"?(current||"완료"):"도착한 사람"}</b></div>
   <div className="drawGrid"><section>{mode==="touch"?<div className="nameButtons">{waiting.map(n=><button key={n} disabled={!!who} onClick={()=>draw(n)}>{n}<small>터치해서 뽑기</small></button>)}</div>:<div className="current"><small>현재 차례</small><strong>{current||"모두 완료"}</strong>{current&&<><button className="primary" onClick={()=>draw(current)}>지금 뽑기</button><button className="skip" onClick={skip}>이번 차례 넘기기 →</button></>}</div>}</section><section className={`number ${who?"spin":""} ${rolling==="꽝"?"blank":""}`}><small>{who?`${who}님 뽑는 중`:popup?popup.name:"READY"}</small><strong>{rolling}<i>{rolling!=="?"&&rolling!=="꽝"?"번":""}</i></strong></section></div>
   <div className="resultList">{results.map((r,i)=><span key={r.name} className={r.blank?"isBlank":""}><i>{i+1}</i><b>{r.name}</b><strong>{r.blank?"꽝":`${r.seat}번`}</strong></span>)}</div><div className="bottomBtns"><button className="ghost" onClick={restart}>설정으로</button><button className="ghost danger" onClick={()=>confirm("결과를 초기화할까요?")&&restart()}>게임 초기화</button></div>
  </>}
  {countdown&&<div className="countdown"><i/><i/><i/><strong>{countdown}</strong><p>행운의 뽑기를 시작합니다</p></div>}
  {popup&&<div className={`resultPopup ${popup.blank?"lose":"win"}`}><div className="confetti">{Array.from({length:18},(_,i)=><i key={i} style={{"--i":i}}/>)}</div><small>{popup.name}님의 결과</small><strong>{popup.blank?"꽝!":`${popup.seat}번`}</strong><p>{popup.blank?"아쉽지만 다음 기회에!":"축하합니다! 자리가 정해졌어요 🎉"}</p></div>}
 </Game>
}
function Roulette({names,openRoster}){const[deg,setDeg]=useState(0),[winner,setWinner]=useState(""),[spinning,setSpinning]=useState(false);const spin=()=>{if(spinning)return;setSpinning(true);const pick=names[Math.floor(Math.random()*names.length)];setWinner("");setDeg(d=>d+1800+Math.random()*360);setTimeout(()=>{setWinner(pick);setSpinning(false)},2000)};return <Game title="룰렛 돌리기" sub="버튼을 눌러 행운의 참가자를 선택하세요" icon="🎡">{!names.length?<Need openRoster={openRoster}/>:<div className="roulette"><div className="pointer">▼</div><div className="wheel" style={{transform:`rotate(${deg}deg)`,background:`conic-gradient(${names.slice(0,12).map((_,i)=>`hsl(${i*43} 78% 55%) ${i*100/Math.min(names.length,12)}% ${(i+1)*100/Math.min(names.length,12)}%`).join(",")})`}}><b>LUCKY</b></div><h3>{winner?`🎉 ${winner} 당첨!`:"누가 뽑힐까요?"}</h3><button className="primary" onClick={spin} disabled={spinning}>룰렛 돌리기</button></div>}</Game>}
function Teams({names,genders,openRoster}){
 const[count,setCount]=useState(2),[teams,setTeams]=useState([]),[mode,setMode]=useState("random"),[notice,setNotice]=useState("");
 const genderOf=n=>genders?.[n]||"none";
 const putSmallest=(teamList,namesToPut)=>shuffle(namesToPut).forEach(n=>{const min=Math.min(...teamList.map(t=>t.length));const candidates=teamList.map((t,i)=>t.length===min?i:-1).filter(i=>i>=0);const pick=candidates[Math.floor(Math.random()*candidates.length)];teamList[pick].push(n)});
 const distribute=(group,teamCount)=>{const result=Array.from({length:teamCount},()=>[]);const groupSize=Math.floor(group.length/teamCount);const groupExtra=group.length%teamCount;let idx=0;for(let i=0;i<teamCount;i++){const size=groupSize+(i<groupExtra?1:0);for(let j=0;j<size;j++){result[i].push(group[idx++])}}return result};
 const make=()=>{
  const safe=Math.min(names.length,Math.max(2,Number(count)||2)),t=Array.from({length:safe},()=>[]);
  if(mode==="random"){
   shuffle(names).forEach((n,i)=>t[i%safe].push(n));setNotice("완전 랜덤으로 배정했습니다.");setTeams(t);return;
  }
  const male=shuffle(names.filter(n=>genderOf(n)==="male")),female=shuffle(names.filter(n=>genderOf(n)==="female")),none=shuffle(names.filter(n=>genderOf(n)==="none"));
  if(!male.length&&!female.length){shuffle(names).forEach((n,i)=>t[i%safe].push(n));setNotice("성별 정보가 없어 완전 랜덤 방식으로 배정했습니다.");setTeams(t);return;}
  const maleDistributed=distribute(male,safe),femaleDistributed=distribute(female,safe),noneDistributed=distribute(none,safe);
  for(let i=0;i<safe;i++){t[i].push(...maleDistributed[i],...femaleDistributed[i],...noneDistributed[i])}
  setNotice("각 팀의 전체 인원 차이가 최대 1명이며, 남녀 성별도 최대한 균등하게 배정했습니다.");
  setTeams(t);
 };
 const stats=t=>({m:t.filter(n=>genderOf(n)==="male").length,f:t.filter(n=>genderOf(n)==="female").length,x:t.filter(n=>genderOf(n)==="none").length});
 return <Game title="팀 자동 나누기" sub="완전 랜덤 또는 남녀 균형 방식으로 팀을 나눕니다" icon="👥">{!names.length?<Need openRoster={openRoster}/>:<>
  <div className="teamSetup"><label>팀 수 <input type="number" min="2" max={Math.max(2,names.length)} value={count} onChange={e=>setCount(e.target.value===""?"":Math.min(Math.max(2,names.length),+e.target.value))} onBlur={()=>setCount(v=>v===""||Number(v)<2?2:Math.min(Math.max(2,names.length),Number(v)))}/></label><div className="teamMode"><small>배정 방식</small><div className="seg"><button className={mode==="random"?"on":""} onClick={()=>setMode("random")}>🎲 완전 랜덤</button><button className={mode==="balanced"?"on":""} onClick={()=>setMode("balanced")}>⚖️ 남녀 균형</button></div></div><button className="primary" onClick={make}>팀 나누기</button></div>
  {mode==="balanced"&&<div className="teamInfo"><span>남성 <b>{names.filter(n=>genderOf(n)==="male").length}</b></span><span>여성 <b>{names.filter(n=>genderOf(n)==="female").length}</b></span><span>선택 안 함 <b>{names.filter(n=>genderOf(n)==="none").length}</b></span><button className="ghost" onClick={openRoster}>성별 설정</button></div>}
  {notice&&<p className="teamNotice">{notice}</p>}
  <div className="teams">{teams.map((t,i)=>{const st=stats(t);return <article key={i}><h3>TEAM {i+1}<small>{mode==="balanced"&&<>남 {st.m} · 여 {st.f}{st.x?` · 미선택 ${st.x}`:""}</>}</small></h3>{t.map(n=><span key={n}><b>{n}</b>{mode==="balanced"&&<i className={`genderBadge ${genderOf(n)}`}>{genderOf(n)==="male"?"남":genderOf(n)==="female"?"여":"-"}</i>}</span>)}</article>})}</div>
 </>}</Game>
}
const MISSIONS=["옆 사람 칭찬 한마디 하기","10초 동안 춤추기","오늘 가장 웃긴 표정 짓기","간식 하나 나눠주기","다음 게임 진행자 맡기","최근 사진 한 장 보여주기","노래 한 소절 부르기","모두와 하이파이브 하기"];
function Mission({names,openRoster}){const[m,setM]=useState(null),[busy,setBusy]=useState(false);const go=()=>{setBusy(true);setM(null);setTimeout(()=>{setM({name:names[Math.floor(Math.random()*names.length)],mission:MISSIONS[Math.floor(Math.random()*MISSIONS.length)]});setBusy(false)},700)};return <Game title="랜덤 미션" sub="누가 어떤 미션을 할지 한 번에 뽑아요" icon="🎲">{!names.length?<Need openRoster={openRoster}/>:<div className={`mission ${busy?"spin":""}`}><span>?</span><h2>{busy?"미션 선택 중…":m?m.name:"READY"}</h2><p>{m?m.mission:"버튼을 눌러 랜덤 미션을 시작하세요."}</p><button className="primary" onClick={go}>랜덤 미션 뽑기</button></div>}</Game>}
function Ladder({names,openRoster}){
 const players=names.slice(0,8),rows=15;
 const[picked,setPicked]=useState(null),[outcomes,setOutcomes]=useState([]),[bridges,setBridges]=useState([]),[editing,setEditing]=useState(false),[started,setStarted]=useState(false),[pattern,setPattern]=useState(0),[sound,setSound]=useState(true),[effectKey,setEffectKey]=useState(0),[route,setRoute]=useState([]),[wormStep,setWormStep]=useState(0),[revealed,setRevealed]=useState(false);
 const timerRef=useRef(null);

 const play=(kind)=>{if(!sound)return;try{const C=window.AudioContext||window.webkitAudioContext,ctx=new C(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);const map={add:[660,.08],remove:[260,.08],shuffle:[420,.12],start:[520,.18],step:[720,.045],result:[880,.32]};const[f,d]=map[kind]||[440,.1];osc.frequency.setValueAtTime(f,ctx.currentTime);if(kind==="result")osc.frequency.exponentialRampToValueAtTime(1320,ctx.currentTime+d);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(kind==="step"?.07:.18,ctx.currentTime+.01);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);osc.start();osc.stop(ctx.currentTime+d+.02);osc.onended=()=>ctx.close()}catch{}};

 // 같은 번호를 넣으면 항상 같은 기본 사다리가 만들어지는 간단한 난수 생성기
 const seededRandom=(seed)=>()=>{seed=(seed*9301+49297)%233280;return seed/233280};

 // 참가자 수에 맞춰 10종의 촘촘한 기본 사다리를 생성
 const makePreset=(idx)=>{
  const rnd=seededRandom((idx+1)*7919+players.length*101);
  const made=[];
  for(let r=0;r<rows;r++){
   const candidates=Array.from({length:Math.max(0,players.length-1)},(_,i)=>i);
   if((r+idx)%2)candidates.reverse();
   let last=-99;
   candidates.forEach(c=>{
    if(Math.abs(c-last)<=1)return;
    const density=.67+((idx%4)*.04);
    if(rnd()<density){made.push([r,c]);last=c}
   });
   // 너무 비어 보이는 행은 한 줄 보강
   if(players.length>1&&!made.some(([rr])=>rr===r)&&rnd()<.72){
    const c=Math.floor(rnd()*(players.length-1));
    made.push([r,c]);
   }
  }
  return made;
 };

 const defaultResults=["🎉 당첨","😈 벌칙","💰 벙비 몰빵","😵 꽝","🍺 한잔","🔄 다시하기","🎁 선물","⭐ 자유"];
 const loadPattern=(idx,{keepResults=true}={})=>{
  if(timerRef.current)clearInterval(timerRef.current);
  setPattern(idx);
  setBridges(makePreset(idx));
  if(!keepResults||outcomes.length!==players.length)setOutcomes(players.map((_,i)=>defaultResults[i%defaultResults.length]));
  setPicked(null);setRoute([]);setWormStep(0);setRevealed(false);setEditing(false);setStarted(false);
 };

 useEffect(()=>{
  if(players.length>=2){
   const idx=Math.floor(Math.random()*10);
   setPattern(idx);
   setBridges(makePreset(idx));
   setOutcomes(players.map((_,i)=>defaultResults[i%defaultResults.length]));
   setPicked(null);setRoute([]);setWormStep(0);setRevealed(false);setEditing(false);setStarted(false);
  }
  return()=>{if(timerRef.current)clearInterval(timerRef.current)}
 },[names.length]);

 const hasBridge=(r,c)=>bridges.some(([rr,cc])=>rr===r&&cc===c);

 const toggleBridge=(r,c)=>{
  if(!editing||started)return;
  if(hasBridge(r,c)){
   setBridges(v=>v.filter(([rr,cc])=>!(rr===r&&cc===c)));
   play("remove");
   return;
  }
  if(hasBridge(r,c-1)||hasBridge(r,c+1))return;
  setBridges(v=>[...v,[r,c]]);
  play("add");
 };

 const xOf=(col)=>players.length<=1?50:col*100/(players.length-1);

 // 실제 이동 경로를 좌표 목록으로 계산
 const buildRoute=(startCol)=>{
  let pos=startCol;
  const points=[{x:xOf(pos),y:0,col:pos}];
  for(let r=0;r<rows;r++){
   const y=(r+.5)*100/rows;
   points.push({x:xOf(pos),y,col:pos});
   if(hasBridge(r,pos)){
    pos++;
    points.push({x:xOf(pos),y,col:pos});
   }else if(hasBridge(r,pos-1)){
    pos--;
    points.push({x:xOf(pos),y,col:pos});
   }
  }
  points.push({x:xOf(pos),y:100,col:pos});
  return points;
 };

 const destination=(start)=>buildRoute(start).at(-1)?.col??start;

 const choose=(i)=>{
  if(!started)return;
  if(timerRef.current)clearInterval(timerRef.current);
  const nextRoute=buildRoute(i);
  setPicked(i);
  setRoute(nextRoute);
  setWormStep(0);
  setRevealed(false);

  let step=0;
  timerRef.current=setInterval(()=>{
   step++;
   setWormStep(Math.min(step,nextRoute.length-1));
   if(step<nextRoute.length-1){
    if(step%3===0)play("step");
   }else{
    clearInterval(timerRef.current);
    timerRef.current=null;
    setRevealed(true);
    setEffectKey(v=>v+1);
    play("result");
   }
  },175);
 };

 const another=()=>{
  let next=pattern;
  while(next===pattern)next=Math.floor(Math.random()*10);
  loadPattern(next,{keepResults:true});
  play("shuffle");
 };

 const begin=()=>{
  if(outcomes.some(v=>!String(v||"").trim()))return alert("모든 결과칸을 입력해주세요.");
  setStarted(true);setEditing(false);setPicked(null);setRoute([]);setRevealed(false);play("start");
 };

 const changeOutcome=(i,value)=>setOutcomes(v=>v.map((item,idx)=>idx===i?value:item));
 const dest=picked==null?null:destination(picked);
 const polyline=route.map(p=>`${p.x},${p.y}`).join(" ");
 const worm=route[wormStep]||null;

 return <Game title="사다리타기" sub="기본 사다리를 그대로 쓰거나 모임장이 선과 결과를 직접 설정하세요" icon="🪜">{!names.length?<Need openRoster={openRoster}/>:names.length>8?<div className="need"><span>🪜</span><h3>사다리타기는 최대 8명까지 참여할 수 있습니다.</h3><button className="primary" onClick={openRoster}>명단 수정하기</button></div>:players.length<2?<div className="need"><span>🪜</span><h3>사다리게임은 2명 이상 필요해요</h3><button className="primary" onClick={openRoster}>명단 수정하기</button></div>:<div className="ladder">
  <div className="ladderToolbar">
   <div><b>기본 사다리 {pattern+1} · {rows}단</b><small>{started?"게임 진행 중 · 편집 잠금":editing?"빈 칸 클릭 = 선 추가 · 기존 선 클릭 = 삭제":"마음에 들면 그대로 시작하고, 필요하면 선과 결과를 수정하세요"}</small></div>
   <button className="soundBtn" onClick={()=>setSound(v=>!v)}>{sound?"🔊 효과음":"🔇 무음"}</button>
  </div>

  <div className="ladderNames" style={{"--players":players.length}}>
   {players.map((n,i)=><button key={n} disabled={!started} className={picked===i?"selected":""} onClick={()=>choose(i)}>{n}</button>)}
  </div>

  <div className={`ladderBoard ${editing?"editing":""} ${route.length?"showRoute":""}`} style={{"--players":players.length,"--rows":rows}}>
   {players.map((_,i)=><i className="ladderV" key={`v${i}`} style={{left:`${i*100/(players.length-1)}%`}}/>)}

   {Array.from({length:rows},(_,r)=>Array.from({length:players.length-1},(_,c)=>
    <button key={`${r}-${c}`} aria-label={`가로선 ${r+1}-${c+1}`} className={`bridgeSlot ${hasBridge(r,c)?"has":""}`} style={{left:`${c*100/(players.length-1)}%`,top:`${(r+.5)*100/rows}%`,width:`${100/(players.length-1)}%`}} onClick={()=>toggleBridge(r,c)} disabled={started||(!editing&&!hasBridge(r,c))}/>
   ))}

   {route.length>0&&<svg className="routeOverlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline className="routeGlow" points={polyline}/>
    <polyline className="routeLine" points={polyline}/>
   </svg>}

   {worm&&<div className={`ladderWorm ${revealed?"arrived":""}`} style={{left:`${worm.x}%`,top:`${worm.y}%`}} aria-hidden="true">
    <span>🐛</span><i/>
   </div>}
  </div>

  <div className="ladderResultEditor" style={{"--players":players.length}}>
   {players.map((_,i)=>!started?
    <label key={i}><small>결과 {i+1}</small><input value={outcomes[i]||""} maxLength="18" placeholder="결과 입력" onChange={e=>changeOutcome(i,e.target.value)}/></label>
    :<span key={i} className={revealed&&dest===i?"selected":""}>{revealed&&dest===i?outcomes[i]:"?"}</span>
   )}
  </div>

  {!started&&<div className="quickResults"><small>빠른 입력 예시</small><span>🎉 당첨</span><span>😈 벌칙</span><span>💰 벙비 몰빵</span><span>😵 꽝</span><span>🍺 한잔</span></div>}

  <h3>{!started?"사다리와 결과를 확인한 뒤 게임을 시작하세요":picked==null?"이름을 선택하세요":!revealed?`${players[picked]}의 지렁이가 사다리를 타는 중… 🐛`:`${players[picked]} → ${outcomes[dest]}`}</h3>

  {revealed&&picked!=null&&<div key={effectKey} className={`ladderFx ${outcomes[dest]?.includes("당첨")?"winner":"normal"}`} aria-hidden="true">{Array.from({length:outcomes[dest]?.includes("당첨")?30:14},(_,i)=><i key={i} style={{"--i":i,"--x":`${(i*37)%100}%`,"--d":`${(i%7)*.08}s`}}>{i%4===0?"★":i%4===1?"✦":i%4===2?"✨":"❄"}</i>)}</div>}

  <div className="ladderActions">
   {!started&&<>
    <button className="ghost" onClick={another}>🔀 다른 사다리</button>
    <button className={`ghost ${editing?"active":""}`} onClick={()=>setEditing(v=>!v)}>✏️ {editing?"편집 완료":"선 편집"}</button>
    <button className="primary" onClick={begin}>🎮 게임 시작</button>
   </>}
   {started&&<button className="ghost" onClick={()=>{if(timerRef.current)clearInterval(timerRef.current);timerRef.current=null;setStarted(false);setPicked(null);setRoute([]);setRevealed(false)}}>설정으로 돌아가기</button>}
  </div>
 </div>}</Game>}

function Game({title,sub,icon,children}){return <section className="game"><header><i>{icon}</i><div><h1>{title}</h1><p>{sub}</p></div></header><div className="gameBody">{children}</div></section>}

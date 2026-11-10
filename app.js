// 職域の一次判定。官公署提出書類という理由だけで行政書士へ振り分けず、根拠法令・手続内容を優先する。
const rules={
 lawyer:["労働審判","訴訟","裁判","調停","代理交渉","示談","損害賠償","慰謝料","解雇無効","未払賃金","残業代請求","紛争","差押","債権回収","逮捕","刑事事件","告訴","離婚","親権","相手方と争"],
 labor:["社会保険の資格取得","社会保険の資格喪失","健康保険の手続","厚生年金の手続","雇用保険の手続","労働保険の年度更新","労働保険の成立届","労災保険の給付申請","労働社会保険諸法令","算定基礎届","月額変更届","賞与支払届","36協定","就業規則","労働者名簿","賃金台帳","雇用保険","助成金の申請","労務管理","給与計算","傷病手当金","育児休業給付","介護休業給付","障害年金","遺族年金"],
 admin:["建設業許可","飲食店営業許可","産業廃棄物収集運搬許可","風俗営業許可","古物商許可","宅建業免許","在留資格申請","ビザ申請","帰化申請","車庫証明","自動車登録","農地転用","開発許可","旅館業許可","補助金申請書","遺言書作成","遺産分割協議書作成","契約書作成","内容証明郵便の文案","官公署への許認可申請"],
 judicial:["不動産登記","所有権移転登記","抵当権","相続登記","商業登記","法人登記","会社設立登記","役員変更登記","供託","成年後見"],
 tax:["確定申告","税務申告","法人税","所得税","消費税","相続税","贈与税","税務調査","節税相談","税務相談","決算申告","記帳代行"],
 patent:["特許","商標","意匠","実用新案","知的財産","知財","特許庁"]
};
const names={lawyer:"弁護士",labor:"社会保険労務士",admin:"行政書士",judicial:"司法書士",tax:"税理士",patent:"弁理士"};
const form=document.querySelector("#judge-form"),input=document.querySelector("#matter"),count=document.querySelector("#count"),result=document.querySelector("#result");
if(form&&input&&count&&result){
 input.addEventListener("input",()=>count.textContent=`${input.value.length} / 1200`);
 form.addEventListener("submit",e=>{
  e.preventDefault();const text=input.value.trim();if(!text)return;
  const hit=k=>rules[k].filter(w=>text.includes(w));
  const lh=hit("lawyer"),sh=hit("labor"),ah=hit("admin");
  const found=Object.keys(rules).map(k=>({key:k,words:hit(k)})).filter(x=>x.words.length);
  let title,lead,reasons=[],action,cls="border";
  if(lh.length){
   cls="lawyer";title="弁護士への相談を優先してください";
   lead="紛争・請求・代理交渉等のシグナルが検出されました。労務手続と紛争解決は分けて考える必要があります。";
   reasons.push("紛争シグナル："+lh.slice(0,5).join("、"));
   if(sh.length)reasons.push("労働・社会保険の手続や通常の労務管理は社労士も関連します。紛争対応は弁護士を優先し、特定社労士のADR代理等は法定範囲を個別確認してください。");
   if(ah.length)reasons.push("許認可等の別個の行政手続は行政書士が関連する可能性があります。");
   action="通知書・契約書・勤怠記録・期限を整理し、まず弁護士へ相談してください。";
  }else if(sh.length&&ah.length){
   cls="border";title="社労士と行政書士の分担が必要な複合案件です";
   lead="労働・社会保険法令に基づく手続と、別個の許認可・行政手続の両方が含まれています。";
   reasons.push("社労士関連："+sh.slice(0,5).join("、"));
   reasons.push("行政書士関連："+ah.slice(0,5).join("、"));
   reasons.push("労働・社会保険諸法令に基づく申請書等の作成・提出代行は社労士法上の業務制限を確認します。一般的な行政書士の書類作成権限で代替できると扱いません。");
   action="労働・社会保険手続は社労士、別個の許認可は行政書士へ分けて相談してください。";
  }else if(sh.length){
   cls="labor";title="社会保険労務士領域の可能性が高いです";
   lead="労働・社会保険諸法令に基づく手続・帳簿・労務管理に関する語句が検出されました。";
   reasons.push("社労士関連："+sh.slice(0,6).join("、"));
   reasons.push("官公署へ提出する書類であっても、根拠法令が労働・社会保険諸法令であれば社労士法の業務制限を確認します。");
   action="手続名・根拠法令・提出先を整理し、社労士へ受任範囲を確認してください。";
  }else if(found.length){
   const first=found[0],second=found[1];cls=first.key==="lawyer"?"lawyer":first.key;
   title="第1候補："+names[first.key];lead="入力内容から関連する専門領域を検出しました。";
   reasons.push(names[first.key]+"関連："+first.words.slice(0,5).join("、"));
   if(second)reasons.push("関連領域："+names[second.key]+"（"+second.words.slice(0,3).join("、")+"）");
   action="具体的な手続名と依頼範囲を伝え、受任可能か専門家へ確認してください。";
  }else{
   title="境界／要確認です";lead="入力内容だけでは専門領域を安全に特定できませんでした。";
   reasons.push("提出先だけでなく、書類の根拠法令・目的・依頼したい作業を確認してください。");
   reasons.push("許認可、労働・社会保険手続、紛争対応が混在する場合は複数士業に分かれることがあります。");
   action="手続名・書類名・提出先・争いの有無を整理して専門家へ相談してください。";
  }
  result.replaceChildren();result.className="result "+cls;
  const el=(tag,value)=>{const n=document.createElement(tag);n.textContent=value;return n;};
  result.append(el("span","一次判定結果"),el("h3",title),el("p",lead),el("h4","判定理由"));
  const ul=document.createElement("ul");reasons.forEach(x=>ul.append(el("li",x)));result.append(ul);
  const p=document.createElement("p"),b=el("strong","次の一歩：");p.append(b,document.createTextNode(action));result.append(p,el("small","本結果は相談先選びの一般的な目安であり、個別案件の法的判断・受任可否を示すものではありません。"));
  result.hidden=false;result.scrollIntoView({behavior:"smooth",block:"center"});
 });
}
import requestAnimationFrame, {
  allRegisterdFrames,
  frameRate,
} from "./src/requestAnimationFrame";

let p = 0;
const excOrder = [];
const calledNextTick = () => {
  p += 2; // callback impact
  excOrder.push(1);
};
const calledInTheSecondTick = () => {
  p += 5; // callback impact
  excOrder.push(2);
};
const calledInTheSecondTickWithTrack = (id) =>
  function withTrack() {
    p += 6; // callback impact
    excOrder.push(`3_${id}`);
  };
const frameTwo = requestAnimationFrame(calledInTheSecondTick, 1);
requestAnimationFrame(calledInTheSecondTickWithTrack("1"), 1);
requestAnimationFrame(calledInTheSecondTickWithTrack("2"), 1);
requestAnimationFrame(calledInTheSecondTickWithTrack("3"), 1);
requestAnimationFrame(calledInTheSecondTickWithTrack("4"), 1);
requestAnimationFrame(calledInTheSecondTickWithTrack("5"), 1);
// will  be called first
const frameOne = requestAnimationFrame(calledNextTick);

console.log(`Frame One Id =${frameOne[0]} First Task Id =${frameOne[1]}`, frameOne);
console.log(`Frame Two Id =${frameTwo[0]} First Task Id =${frameTwo[1]}`, frameTwo);

console.log("All Registerd Frames At First", allRegisterdFrames);

console.log(`***********************************************`);
 
setTimeout(() => {
  console.log(`Task Execution Order= ${excOrder.join()} `);
  console.log(`Changes to p= ${p} `);
  console.log("All Registerd Frames After Execution Passed ", allRegisterdFrames);
}, frameRate * 50);

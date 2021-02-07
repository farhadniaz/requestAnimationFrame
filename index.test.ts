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
const calledInTheSecondTickWithTrack = (id) => {
  p += 6; // callback impact
  excOrder.push(`3_${id}`);
};
const framTwo = requestAnimationFrame(calledInTheSecondTick, 1);
requestAnimationFrame(() => calledInTheSecondTickWithTrack("1"), 1);
requestAnimationFrame(() => calledInTheSecondTickWithTrack("2"), 1);
requestAnimationFrame(() => calledInTheSecondTickWithTrack("3"), 1);
requestAnimationFrame(() => calledInTheSecondTickWithTrack("4"), 1);
requestAnimationFrame(() => calledInTheSecondTickWithTrack("5"), 1);
// will  be called first
const framOne = requestAnimationFrame(calledNextTick);

test("check registerd frams", () => {
  expect(allRegisterdFrames.size).toBe(2);
}); 

test("check registerd frams task count ", () => {
  const [framNumber] = framOne;
  const framOneSize = allRegisterdFrames.get(framNumber).size;
  expect(framOneSize).toBe(1);

  const [framTwo_framNumber] = framTwo;
  const framTwoSize = allRegisterdFrames.get(framTwo_framNumber).size;
  expect(framTwoSize).toBe(6);
});

test("check registerd frams to be empty after frams passes", (done) => {
  setTimeout(() => {
    const [framNumber] = framOne;
    const framOneSize = allRegisterdFrames.get(framNumber)?.size;
    expect(framOneSize).toBe(undefined);

    const [framTwo_framNumber] = framTwo;
    const framTwoSize = allRegisterdFrames.get(framTwo_framNumber)?.size;
    expect(framTwoSize).toBe(undefined);
    done();
  }, frameRate * 50);
});

test("check values and excutin order after frams pass", (done) => {
  setTimeout(() => {
    const callOrderToBe = "1,2,3_1,3_2,3_3,3_4,3_5";
    expect(excOrder.join()).toBe(callOrderToBe);
    expect(p).toBe(37);

    done();
  }, frameRate * 60);
});

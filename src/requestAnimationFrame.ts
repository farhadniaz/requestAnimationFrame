import { performance } from "perf_hooks";

export type FrameId = number;
export type TaskId = number;
export type RequestAnimId = [FrameId, TaskId];

export const frameRate = 1000 / 60;
export const allRegisterdFrames = new Map();

const getCurrentFrameNumber = () => {
  return Math.ceil(performance.now() / frameRate);
};

const removeRequestAnimFrameFromList = (id) => {
  const [frameNumber, taskId] = id;
  const frameTasks = allRegisterdFrames.get(frameNumber);
  const deletetionResult = frameTasks.delete(taskId);

  // check if frame is empty then remove it
  if (frameTasks.size == 0) {
    allRegisterdFrames.delete(frameNumber);
  }
  return deletetionResult;
};
export const cancelRequestAnimFrame = (id) => {
  removeRequestAnimFrameFromList(id);
};

const requestAnimationFrame = (cb, tick = 0): RequestAnimId => {
  const frameNumber = getCurrentFrameNumber();
  const frameNumberToUse = frameNumber + (tick + 2);
  const isExist = allRegisterdFrames.get(frameNumberToUse);
  if (isExist) {
    const id = isExist.size + 1;
    isExist.set(id, cb);
    return [frameNumberToUse, id];
  } else {
    const id = 1;
    const freamCalbacks = new Map();
    freamCalbacks.set(id, cb);

    allRegisterdFrames.set(frameNumberToUse, freamCalbacks);

    return [frameNumberToUse, id];
  }
};

export const frameLoopFunc = () => {
  const frameNumber = getCurrentFrameNumber();
  const currentFrameTasks = allRegisterdFrames.get(frameNumber);
  if (currentFrameTasks) {
    // run frame tasks
    currentFrameTasks.forEach((task, taskId) => {
      task();
      removeRequestAnimFrameFromList([frameNumber, taskId]);
    });
  }
};

export const requestAnimationFrameLoop = setInterval(frameLoopFunc, frameRate);

export default requestAnimationFrame;

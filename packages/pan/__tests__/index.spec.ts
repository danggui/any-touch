import Pan from '@any-touch/pan';
import AnyTouch from '@any-touch/core';
AnyTouch.use(Pan);
import { sleep, GestureSimulator, panSimulator } from '@any-touch/simulator'
const PAN_NAME = 'pan';

test(`加载${PAN_NAME}, 触发一次${PAN_NAME}`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const onPan = jest.fn();
    at.on(PAN_NAME, onPan);
    const gs = new GestureSimulator(el);
    gs.start();
    await sleep(25);
    gs.move([{ x: 0, y: 11 }]);
    await sleep(25);
    gs.move([{ x: 0, y: 21 }]);
    await sleep(25);
    gs.move([{ x: 0, y: 31 }]);
    await sleep(25);
    gs.end();
    await sleep();
    expect(onPan).toHaveBeenCalledTimes(3);
    at.destroy
    done();
});

test(`触发${PAN_NAME}left`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCB = jest.fn();
    at.on(`${PAN_NAME}left`, (ev) => {
        mockCB(ev.type)
    });

    await panSimulator(el, [{ x: 100, y: 100 }], [{ x: 0, y: 11 }])

    expect(mockCB).toHaveBeenCalledTimes(1);
    expect(mockCB).toHaveBeenNthCalledWith(1, `${PAN_NAME}left`);
    // 此处增加panright操作会报错, 实际页面并没有报错, 后续需要检查是否touch模拟器写的有问题
    done();
});


test(`触发${PAN_NAME}down`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCB = jest.fn();
    at.on(`${PAN_NAME}down`, (ev) => {
        mockCB(ev.type)
    });
    const gs = new GestureSimulator(el);
    gs.start();
    // 保证compute开始计算方向了
    await sleep(25);
    gs.move([{ x: 0, y: 11 }]);
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(1);
    expect(mockCB).toHaveBeenNthCalledWith(1, `${PAN_NAME}down`);
    // 此处增加panright操作会报错, 实际页面并没有报错, 后续需要检查是否touch模拟器写的有问题
    done();
});

test(`模拟pancancel`, async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const onPan = jest.fn().mockName('onPan');
    const onPanCancel = jest.fn().mockName('onPanCancel');

    at.on('pan', onPan);
    at.on('pancancel', onPanCancel);
    gs.start();
    await sleep(25);
    gs.move([{ x: 10, y: 0 }]);
    await sleep(25);
    gs.cancel();
    await sleep();
    // expect(onPan).toHaveBeenCalledTimes(2);
    expect(onPanCancel).toHaveBeenCalledTimes(1);
    done();
});


test('触发一次panend', async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const onPanend = jest.fn().mockName('onPanend');
    at.on('panend', onPanend);
    gs.start();
    await sleep(25);
    gs.move([{ x: 10, y: 0 }]);
    await sleep(25);
    gs.end();
    await sleep();
    expect(onPanend).toHaveBeenCalledTimes(1);
    done();
});
describe(__filename, () => {
  describe(`object([plan]) - 檢查輸入值為物件`, async () => {
    describe(`object()`, async () => {
      const errMsg = `the input only accepts Object`

      it(`通過: {}`, async () => {
        const input = {}
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: Object.create(null)`, async () => {
        const input = Object.create(null)
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: Object(null)`, async () => {
        const input = Object(null)
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: []`, async () => {
        const input = []
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: null`, async () => {
        const input = null
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: function () {}`, async () => {
        const input = function () {}
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: 'str'`, async () => {
        const input = `str`
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: 123`, async () => {
        const input = 123
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object({base: cc.string(), obj: {b: cc.number()}, arr: [cc.ref('a')], val: 1})`, async () => {
      const plan = {base: cc.string(), obj: {b: cc.number()}, arr: [cc.ref('base')], val: 1}

      it(`通過: {base: 'str', obj: {b: 3}, arr: ['str'], val: 1}`, async () => {
        const input = {base: 'str', obj: {b: 3}, arr: ['str'], val: 1}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {base: 'str', obj: 'err', arr: ['str'], val: 1}`, async () => {
        const errMsg = `obj only accepts Object`
        const input = {base: 'str', obj: 'err', arr: ['str'], val: 1}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `obj`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {base: 'str', obj: {b: 'err'}, arr: ['str'], val: 1}`, async () => {
        const errMsg = `b only accepts Number`
        const input = {base: 'str', obj: {b: 'err'}, arr: ['str'], val: 1}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `obj.b`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {base: 'str', obj: {b: 3}, arr: ['err'], val: 1}`, async () => {
        const errMsg = `the array-element in arr only accepts "str"`
        const input = {base: 'str', obj: {b: 3}, arr: ['err'], val: 1}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `arr.0`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {base: 'str', obj: {b: 3}, arr: ['str'], val: 2}`, async () => {
        const errMsg = `val only accepts 1`
        const input = {base: 'str', obj: {b: 3}, arr: ['str'], val: 2}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `val`)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object({arg1: cc.object({arg2: 'str'})})`, async () => {
      const plan = {arg1: cc.object({arg2: 'str'})}

      it(`通過: {arg1: {arg2: 'str'}}`, async () => {
        const input = {arg1: {arg2: `str`}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {arg1: {arg2: 'str'}}`, async () => {
        const input = {arg1: undefined}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {arg: 1}`, async () => {
        const errMsg = `arg1 only accepts Object`
        const input = {arg1: 1}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `arg1`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {arg1: {arg2: 1}}`, async () => {
        const errMsg = `arg2 only accepts "str"`
        const input = {arg1: {arg2: 1}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `arg1.arg2`)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

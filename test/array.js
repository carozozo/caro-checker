describe(__filename, () => {
  describe(`array([...enums]) - 檢查是否為陣列`, async () => {
    describe(`array()`, async () => {
      const errMsg = `the input only accepts Array`

      it(`通過: []`, async () => {
        const input = []
        const info = await cc.array().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: Array()`, async () => {
        const input = Array()
        const info = await cc.array().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: undefined`, async () => {
        const input = undefined
        const info = await cc.array().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 123`, async () => {
        const input = 123
        const info = await cc.array().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`array(cc.string(), cc.ref('elem'), undefined)`, async () => {
      const errMsg = `the array-element in arr only accepts String or 1 or undefined`

      const plan = {
        elem: 1,
        arr: cc.array(cc.string(), cc.ref('elem'), undefined),
      }

      it(`通過: {elem: 1, arr: ['str']}`, async () => {
        const input = {elem: 1, arr: ['str']}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {elem: 1, arr: [1]}`, async () => {
        const input = {elem: 1, arr: [1]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {elem: 1, arr: [undefined]}`, async () => {
        const input = {elem: 1, arr: [undefined]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {elem: 1, arr: [2]}`, async () => {
        const input = {elem: 1, arr: [2]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

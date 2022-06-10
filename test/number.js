describe(__filename, () => {
  describe(`number() - 檢查輸入值為數字`, async () => {
    describe(`number()`, async () => {
      const errMsg = `the input only accepts Number`

      it(`通過: 0`, async () => {
        const input = 0
        const info = await cc.number().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: undefined`, async () => {
        const input = undefined
        const info = await cc.number().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: NaN`, async () => {
        const input = NaN
        const info = await cc.number().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: 'str'`, async () => {
        const input = 'str'
        const info = await cc.number().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

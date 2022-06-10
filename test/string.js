describe(__filename, () => {
  describe(`string() - 檢查輸入值為字串`, async () => {
    describe(`string()`, async () => {
      const errMsg = `the input only accepts String`

      it(`通過: ''`, async () => {
        const input = ``
        const info = await cc.string().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: String()`, async () => {
        const input = String()
        const info = await cc.string().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: undefined`, async () => {
        const input = undefined
        const info = await cc.string().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 123`, async () => {
        const input = 123
        const info = await cc.string().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

describe(__filename, () => {
  describe(`boolean() - 檢查輸入值為布林值`, async () => {
    describe(`boolean()`, async () => {
      const errMsg = `the input only accepts Boolean`

      it(`通過: true`, async () => {
        const input = true
        const info = await cc.boolean().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: false`, async () => {
        const input = false
        const info = await cc.boolean().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: undefined`, async () => {
        const input = undefined
        const info = await cc.boolean().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 'str'`, async () => {
        const input = 'str'
        const info = await cc.boolean().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

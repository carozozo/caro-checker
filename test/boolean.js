describe(__filename, () => {
  describe(`boolean() - 檢查輸入值為布林值`, async () => {
    const errMsg = `the input only accepts Boolean`

    describe(`boolean()`, async () => {
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

    describe(`boolean().strict([boolean = true])`, async () => {
      describe(`boolean().strict()`, async () => {
        it(`不通過: 'true'`, async () => {
          const input = 'true'
          const info = await cc.boolean().strict().parse(input)
          assert.strictEqual(info.input, input)
          assert.strictEqual(info.error, errMsg)
        })
      })

      describe(`number().strict(false)`, async () => {
        it(`通過: 'true'`, async () => {
          const input = 'true'
          const info = await cc.boolean().strict(false).parse(input)
          assert.strictEqual(info.input, true)
          assert.strictEqual(info.error, undefined)
        })
        it(`通過: '1'`, async () => {
          const input = '1'
          const info = await cc.boolean().strict(false).parse(input)
          assert.strictEqual(info.input, true)
          assert.strictEqual(info.error, undefined)
        })
        it(`通過: 1`, async () => {
          const input = 1
          const info = await cc.boolean().strict(false).parse(input)
          assert.strictEqual(info.input, true)
          assert.strictEqual(info.error, undefined)
        })
      })
    })
  })
})

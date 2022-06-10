describe(__filename, () => {
  describe(`number().integer() - 檢查整數`, async () => {
    cc.number.postRule.integer = (helper) => {
      if (helper.getInput() % 1 === 0) return
      helper.markError(`{#label#} only accepts Integer`)
    }

    const errMsg = `the input only accepts Integer`

    describe(`number().integer()`, async () => {
      it(`通過: 3`, async () => {
        const input = 3
        const info = await cc.number().integer().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: 3.0`, async () => {
        const input = 3.0
        const info = await cc.number().integer().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 1.1`, async () => {
        const input = 1.1
        const info = await cc.number().integer().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`number().float() - 支援檢查浮點數`, async () => {
    cc.number.postRule.float = (helper) => {
      if (helper.getInput() % 1 !== 0) return
      helper.markError(`{#label#} only accepts float`)
    }

    const errMsg = `the input only accepts float`

    describe(`number().float()`, async () => {
      it(`通過: 3.3`, async () => {
        const input = 3.3
        const info = await cc.number().float().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 3.0`, async () => {
        const input = 3.0
        const info = await cc.number().float().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: 3`, async () => {
        const input = 3
        const info = await cc.number().float().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})


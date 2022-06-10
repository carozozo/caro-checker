describe(__filename, () => {
  describe(`number().min([limit = 1], [exclude = false]) - 檢查最小值`, async () => {
    cc.number.postRule.min = (helper, limit, exclude = false) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if ((!exclude && input >= limit) || (exclude && input > limit)) return
      helper.markError(`{#label} should be${!exclude ? ' equal to or ' : ' '}greater than ${limit}`)
    }

    describe(`number().min()`, async () => {
      const errMsg = `the input should be equal to or greater than 1`

      it(`通過: 1`, async () => {
        const input = 1
        const info = await cc.number().min().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 0.5`, async () => {
        const input = 0.5
        const info = await cc.number().min().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`number().min(3)`, async () => {
      const limit = 3
      const errMsg = `the input should be equal to or greater than ${limit}`

      it(`通過: 3`, async () => {
        const input = 3
        const info = await cc.number().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 2`, async () => {
        const input = 2
        const info = await cc.number().min(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().required(), max: cc.number().min(cc.ref('min'), true).required()}`, async () => {
      const min = 3
      const errMsg = `max should be greater than ${min}`

      const plan = {
        min: cc.number().required(),
        max: cc.number().min(cc.ref('min'), true).required(),
      }

      it(`通過: {min: 3, max: 6}`, async () => {
        const input = {min, max: 6}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {min: 3, max: 3}`, async () => {
        const input = {min, max: 3}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`number().max([limit = 1], [exclude = false]) - 檢查最大值`, async () => {
    cc.number.postRule.max = (helper, limit, exclude = false) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if ((!exclude && input <= limit) || (exclude && input < limit)) return
      helper.markError(`{#label} should be${!exclude ? ' equal to or ' : ' '}less than ${limit}`)
    }

    describe(`number().max()`, async () => {
      const errMsg = `the input should be equal to or less than 1`

      it(`通過: 1`, async () => {
        const input = 1
        const info = await cc.number().max().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 1.5`, async () => {
        const input = 1.5
        const info = await cc.number().max().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`number().max(3)`, async () => {
      const limit = 3
      const errMsg = `the input should be equal to or less than ${limit}`

      it(`通過: 3`, async () => {
        const input = 3
        const info = await cc.number().max(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 4`, async () => {
        const input = 4
        const info = await cc.number().max(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().max(cc.ref('max'), true).required(), max: cc.number().required()}`, async () => {
      const max = 3
      const errMsg = `min should be less than ${max}`

      const plan = {
        min: cc.number().max(cc.ref('max'), true).required(),
        max: cc.number().required(),
      }

      it(`通過: {min: 1, max: 3}`, async () => {
        const input = {min: 1, max}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {min: 3, max: 3}`, async () => {
        const input = {min: 3, max}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`number().integer() - 檢查整數`, async () => {
    cc.number.postRule.integer = (helper) => {
      if (helper.getInput() % 1 === 0) return
      helper.markError(errMsg)
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
      helper.markError(errMsg)
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


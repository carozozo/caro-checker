describe(__filename, () => {
  describe(`number() - 檢查輸入值為數字`, async () => {
    const errMsg = `the input only accepts Number`

    describe(`number()`, async () => {
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

    describe(`number().strict([boolean = true])`, async () => {
      describe(`number().strict()`, async () => {
        it(`不通過: '123'`, async () => {
          const input = '123'
          const info = await cc.number().strict().parse(input)
          assert.strictEqual(info.input, input)
          assert.strictEqual(info.error, errMsg)
        })
      })

      describe(`number().strict(false)`, async () => {
        it(`通過: '123'`, async () => {
          const input = '123'
          const info = await cc.number().strict(false).parse(input)
          assert.strictEqual(info.input, Number(input))
          assert.strictEqual(info.error, undefined)
        })
      })
    })
  })

  describe(`number().min([limit = 1], [exclude = false]) - 檢查最小值`, async () => {
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
})

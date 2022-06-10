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

  describe(`string().size([limit = 1]) - 檢查長度`, async () => {
    describe(`string().size()`, async () => {
      const errMsg = `the input size should be 1`

      it(`通過: '1'`, async () => {
        const input = `1`
        const info = await cc.string().size().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().size().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`string().size(3)`, async () => {
      const size = 3
      const errMsg = `the input size should be ${size}`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().size(size).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().size(size).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{size: cc.number().required(), str: cc.string().size(cc.ref('size')).required()}`, async () => {
      const size = 3
      const errMsg = `str size should be ${size}`

      const plan = {
        size: cc.number().required(),
        str: cc.string().size(cc.ref('size')).required(),
      }

      it(`通過: {size, str: '123'}`, async () => {
        const input = {size, str: '123'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, str: '1234'}`, async () => {
        const input = {size, str: '1234'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`string().min([limit = 1]) - 檢查最小長度`, async () => {
    describe(`string().min()`, async () => {
      const errMsg = `the input size cannot be less than 1`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().min().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: ''`, async () => {
        const input = ''
        const info = await cc.string().min().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`string().min(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be less than ${limit}`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1'`, async () => {
        const input = '1'
        const info = await cc.string().min(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().required(), str: cc.string().min(cc.ref('min')).required()}`, async () => {
      const min = 3
      const errMsg = `str size cannot be less than ${min}`

      const plan = {
        min: cc.number().required(),
        str: cc.string().min(cc.ref('min')).required(),
      }

      it(`通過: {size, str: '123'}`, async () => {
        const input = {min, str: '123'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, str: '1'}`, async () => {
        const input = {min, str: '1'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`string().max([limit = 1]) - 檢查最大長度`, async () => {
    describe('string().max()', async () => {
      const errMsg = `the input size cannot be greater than 1`

      it(`通過: '1'`, async () => {
        const input = `1`
        const info = await cc.string().max().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().max().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe('string().max(3)', async () => {
      const limit = 3
      const errMsg = `the input size cannot be greater than ${limit}`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().max(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().max(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{max: cc.number().required(), str: cc.string().max(cc.ref('max')).required()}`, async () => {
      const max = 3
      const errMsg = `str size cannot be greater than ${max}`

      const plan = {
        max: cc.number().required(),
        str: cc.string().max(cc.ref('max')).required(),
      }

      it(`通過: {size, str: '123'}`, async () => {
        const input = {max, str: '123'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, str: '1234'}`, async () => {
        const input = {max, str: '1234'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

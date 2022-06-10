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

  describe(`array().size([limit = 1]) - 檢查長度`, async () => {
    describe(`array().size()`, async () => {
      const errMsg = `the input size should be 1`

      it(`通過: [1]`, async () => {
        const input = [1]
        const info = await cc.array().size().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1, 2, 3, 4]`, async () => {
        const input = [1, 2, 3, 4]
        const info = await cc.array().size().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`array().size(3)`, async () => {
      const size = 3
      const errMsg = `the input size should be ${size}`

      it(`通過: [1, 2, 3]`, async () => {
        const input = [1, 2, 3]
        const info = await cc.array().size(size).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1, 2, 3, 4]`, async () => {
        const input = [1, 2, 3, 4]
        const info = await cc.array().size(size).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{size: cc.number().required(), arr: cc.array().size(cc.ref('size')).required()}`, async () => {
      const size = 3
      const errMsg = `arr size should be ${size}`

      const plan = {
        size: cc.number().required(),
        arr: cc.array().size(cc.ref('size')).required(),
      }

      it(`通過: [1, 2, 3]`, async () => {
        const input = {size, arr: [1, 2, 3]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1, 2, 3, 4]`, async () => {
        const input = {size, arr: [1, 2, 3, 4]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`array().min([limit = 1]) - 檢查最小長度`, async () => {
    describe(`array().min()`, async () => {
      const errMsg = `the input size cannot be less than 1`

      it(`通過: [1, 2, 3]`, async () => {
        const input = [1, 2, 3]
        const info = await cc.array().min().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: []`, async () => {
        const input = []
        const info = await cc.array().min().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`array().min(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be less than ${limit}`

      it(`通過: [1, 2, 3]`, async () => {
        const input = [1, 2, 3]
        const info = await cc.array().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1]`, async () => {
        const input = [1]
        const info = await cc.array().min(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().required(), arr: cc.array().min(cc.ref('min')).required()}`, async () => {
      const min = 3
      const errMsg = `arr size cannot be less than ${min}`

      const plan = {
        min: cc.number().required(),
        arr: cc.array().min(cc.ref('min')).required(),
      }

      it(`通過: [1, 2, 3]`, async () => {
        const input = {min, arr: [1, 2, 3]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1]`, async () => {
        const input = {min, arr: [1]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`array().max([limit = 1]) - 檢查最大長度`, async () => {
    describe(`array().max()`, async () => {
      const errMsg = `the input size cannot be greater than 1`

      it(`通過: [1]`, async () => {
        const input = [1]
        const info = await cc.array().max().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1, 2, 3, 4]`, async () => {
        const input = [1, 2, 3, 4]
        const info = await cc.array().max().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`array().max(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be greater than ${limit}`

      it(`通過: [1, 2, 3]`, async () => {
        const input = [1, 2, 3]
        const info = await cc.array().max(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1, 2, 3, 4]`, async () => {
        const input = [1, 2, 3, 4]
        const info = await cc.array().max(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{max: cc.number().required(), arr: cc.array().max(cc.ref('max')).required()}`, async () => {
      const max = 3
      const errMsg = `arr size cannot be greater than ${max}`

      const plan = {
        max: cc.number().required(),
        arr: cc.array().max(cc.ref('max')).required(),
      }

      it(`通過: [1, 2, 3]`, async () => {
        const input = {max, arr: [1, 2, 3]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: [1, 2, 3, 4]`, async () => {
        const input = {max, arr: [1, 2, 3, 4]}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

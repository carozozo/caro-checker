describe(__filename, () => {
  describe(`array().size([limit = 1]) - 檢查長度`, async () => {
    cc.array.postRule.size = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (input.length === limit) return
      helper.markError(`{#label} size should be ${limit}`)
    }

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
    cc.array.postRule.min = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (input.length >= limit) return
      helper.markError(`{#label} size cannot be less than ${limit}`)
    }

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
    cc.array.postRule.max = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (input.length <= limit) return
      helper.markError(`{#label} size cannot be greater than ${limit}`)
    }

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

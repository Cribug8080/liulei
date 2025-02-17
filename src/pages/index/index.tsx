import { View, Text, Input, Form, Button, Picker } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.less";
import { useState } from "react";
import Taro from "@tarojs/taro";

const baseRange = new Array(35).fill(1).map((v, i) => ({
  id: i + 2,
  label: i + 2,
}));

console.log(baseRange);

export default function Index() {
  const [formData, setFormData] = useState(() => {
    const inputBase = Number(Taro.getStorageSync("inputBase"));
    const outputBase = Number(Taro.getStorageSync("outputBase"));

    return {
      input: 0,
      output: "",
      inputBase: isNaN(inputBase) || !inputBase ? 8 : inputBase, // 10进制是index 8
      outputBase: isNaN(outputBase) || !outputBase ? 14 : outputBase, // 16进制是index 14
      error: undefined,
    };
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (field === "input") {
      handleTranslate();
    }
  };

  const handleTranslate = () => {
    try {
      const inputBase = baseRange[formData.inputBase]?.id;
      const outputBase = baseRange[formData.outputBase]?.id;

      setFormData((pre) => {
        const num = parseInt(pre.input.toString(), inputBase);

        return {
          ...pre,
          output: num.toString(outputBase),
        };
      });

      formData.inputBase &&
        Taro.setStorageSync("inputBase", formData.inputBase);
      formData.outputBase &&
        Taro.setStorageSync("outputBase", formData.outputBase);
    } catch (error) {
      handleInputChange("error", error.message);
    }
  };

  const handleCopy = () => {
    Taro.setClipboardData({
      data: formData.output, // 要复制的文本
      success() {
        Taro.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
      fail(e) {
        Taro.showToast({
          title: "复制失败",
          icon: "none",
        });
        console.error("复制失败:", e);
      },
    });
  };

  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View style={{ padding: "20px" }}>
      <Form>
        <View className="formLabel">
          <View className="label">输入:</View>
          <Input
            type="number"
            className="input"
            onInput={(e) => handleInputChange("input", e.detail.value)}
          />
        </View>
        <View className="formLabel">
          <View className="label">输入进制:</View>
          <Picker
            mode="selector"
            range={baseRange}
            value={formData.inputBase}
            className="input"
            rangeKey="label"
            onChange={(e) => handleInputChange("inputBase", e.detail.value)}
          >
            <View className="picker">
              {baseRange[formData.inputBase]?.label}
            </View>
          </Picker>
        </View>
        <View className="formLabel">
          <View className="label">输出进制:</View>
          <Picker
            mode="selector"
            range={baseRange}
            value={formData.outputBase}
            className="input"
            rangeKey="label"
            onChange={(e) => handleInputChange("outputBase", e.detail.value)}
          >
            <View className="picker">
              {baseRange[formData.outputBase]?.label}
            </View>
          </Picker>
        </View>
      </Form>
      <Button
        className="btn-max-w"
        plain
        type="primary"
        onClick={handleTranslate}
      >
        转换
      </Button>
      <View onClick={handleCopy} style={{ padding: "36px 0" }}>
        <Text className="label" style={{ paddingRight: "8px" }}>
          结果:
        </Text>
        <Text>{formData.output}</Text>
      </View>
      <View>
        <Text style={{ color: "red" }}>{formData.error}</Text>
      </View>
    </View>
  );
}

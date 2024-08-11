import { ShikiTransformer } from "shiki";
import { visitParents } from "unist-util-visit-parents";

const transforms: Record<string, ShikiTransformer> = {
    "rehype-highlighter-inline-code":
    {
        name: "rehype-highlighter-inline-code",
        code: function (this, element) {
            element.properties.class = element.properties.class || "";
            if (this.pre.properties && this.pre.properties.class && element.properties)
                element.properties.class =
                    element.properties.class + this.pre.properties.class.toString();
            element.properties["data-rh-highlighter-inline"] = true;
        }
    },
    "rehype-highlighter-space-substitution":{
        name: "rehype-highlighter-space-substitution",
        code: function (this, element) {
            visitParents(element, "text", function (node) {
                node.value = node.value.replace(/\s/g, "&nbsp;");
            })
        }
    }

}

export default transforms;
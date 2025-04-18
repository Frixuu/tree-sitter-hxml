/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
    name: "hxml",
    extras: _ => [/\s/],
    rules: {
        hxml: $ => repeat($._line),
        next: $ => "--next",
        each: $ => "--each",

        /////////////////////
        _line: $ =>
            choice(
                $.class_path,
                $.dce,
                $.main,
                $.output,
                $.hxml_file,
                $.library,
                $.define,
                $.resource,
                $.remap,
                $.server_listen,
                $.server_connect,
                $.connect,
                $.comment,
                $.macro,
                $.switch,

                $.next,
                $.each,

                prec.right(10, $.no_param),
                prec.right(11, $.one_param),
            ),

        hxml_file: $ => field("hxml_file", /.*\.hxml/),

        /////////////////////
        class_path: $ =>
            seq(
                choice("--class-path", "-cp", "-p"),
                $._ws,
                field("path", $.text),
            ),

        ////////////////////
        output: $ =>
            choice(
                seq(
                    choice(
                        "--js",
                        "--swf",
                        "--neko",
                        "--jvm",
                        "--python",
                        "--lua",
                        "--hl",
                        "--cppia",
                        "-x",
                    ),
                    field("file", $.text),
                ),
                seq(
                    choice("--php", "--cpp", "--cs", "--java"),
                    field("directory", $.text),
                ),
                seq(choice("--custom-target", "-custom"), $.text),
                choice("--no-output", "--interp"),
                seq("--run", field("main", $.text), repeat($.text)),
            ),

        /////////////////////
        dce_id: $ => "--dce",
        dce: $ => seq($.dce_id, field("dce", choice("std", "full", "no"))),

        ////////////////////
        main_id: $ => choice("--main", "-m"),
        main: $ => seq($.main_id, field("main", $.text)),

        ////////////////////
        library: $ =>
            seq(
                choice("--library", "-lib", "-L"),
                field("name", $.identifier),
                optional(
                    seq(
                        token.immediate(":"),
                        choice(
                            // Haxelib
                            field("version", $.version),

                            // Git
                            prec.left(
                                seq(
                                    token.immediate("git:"),
                                    field("url", $.url),
                                    optional(
                                        seq(
                                            token.immediate("#"),
                                            field("ref", $.text),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),

        ////////////////////
        define_id: $ => choice("-D", "--define"),
        define: $ =>
            seq(
                $.define_id,
                field(
                    "define",
                    seq(
                        field("var", $.text),
                        optional(seq("=", field("value", $.value))),
                    ),
                ),
            ),

        ////////////////////
        resource_id: $ => choice("-r", "--resource"),
        resource: $ =>
            seq(
                $.resource_id,
                field(
                    "resource",
                    seq(
                        field("file", $.text),
                        optional(seq("@", field("name", $.text))),
                    ),
                ),
            ),

        ////////////////////
        remap_id: $ => "--remap",
        remap: $ =>
            seq(
                $.remap_id,
                field("package", $.text),
                ":",
                field("target", $.text),
            ),

        ////////////////////
        server_listen_id: $ => "--server-listen",
        server_listen: $ =>
            seq(
                $.server_listen_id,
                optional(
                    choice(
                        "stdio",
                        field("port", $.number),
                        seq(
                            field("host", $.text),
                            ":",
                            field("port", $.number),
                        ),
                    ),
                ),
            ),

        ///////////////////////////
        server_connect_id: $ => "--server-connect",
        server_connect: $ =>
            seq(
                $.server_connect_id,
                optional(
                    choice(
                        field("port", $.number),
                        seq(
                            field("host", $.text),
                            ":",
                            field("port", $.number),
                        ),
                    ),
                ),
            ),

        ///////////////////////////
        connect_id: $ => "--connect",
        connect: $ =>
            seq(
                $.connect_id,
                optional(
                    choice(
                        field("port", $.number),
                        seq(
                            field("host", $.text),
                            ":",
                            field("port", $.number),
                        ),
                    ),
                ),
            ),

        macro: $ => seq("--macro", $.haxe_expression),

        //////////////////////////
        comment: $ => seq("#", /.+/),

        ////////////////////
        // generic ones
        no_param: $ => choice(/--[a-z]*/, /-[A-Za-z]*/),
        one_param: $ =>
            seq(field("option", $.no_param), field("value", $.text)),

        switch: _ =>
            choice(
                choice("--verbose", "-v"),
                "-debug",
                "--prompt",
                "--no-traces",
                "--display",
                "--times",
                "--no-inline",
                "--no-opt",
                "--flash-strict",
            ),

        ////////////////////

        identifier: $ => /[a-zA-Z_]+[a-zA-Z0-9]*/,
        url: _ => /[^(\#\s)]+/,
        version: _ => /[0-9]+\.[0-9]+\.[0-9]+/,

        text: $ => /[\\.A-Za-z\/_-]+/,
        value: $ => /[\\.A-Za-z0-9\/_-]+/,
        haxe_expression: $ => /[\\.A-Za-z0-9_-]+\(.*\)/,
        number: $ => /[0-9]+/,
        _ws: $ => repeat1(" "),
    },
});

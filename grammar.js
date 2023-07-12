module.exports = grammar({
	name: 'hxml',

	rules: {

		// TODO: put `next` back in here.
		hxml_content: $ => repeat($._section),

		/////////////////////
		_section: $ => choice(
			prec(1,$.each),
			prec(2,$.next)
		),

		////////////////////
		next: $ => seq(
			repeat1($._line),
			'--next'
		),

		each: $ => seq(
			repeat1($._line),
			'--each'
		),

		/////////////////////
		_line: $ => choice(
			$.class_path, $.dce, $.main, $.output,
			$.hxml_file, $.library, $.define, $.resource,
			$.remap, $.server_listen, $.server_connect,
			$.connect,

			prec.right(10,$.no_param),
			prec.right(11,$.one_param)
		),

		hxml_file: $ => field('hxml_file', /.*\.hxml/),

		/////////////////////
		_class_path_id: $ => choice('--class-path','-cp','-p'),
		class_path: $ => seq(
			$._class_path_id, $._ws, field('class_path', $.text)
		),

		////////////////////
		_target: $ => choice('--js', '--swf', '--neko', '--php', '--cpp',
			'--cs', '--java', '--jvm', '--python', '--lua', '--hl',
			'--cppia', '-x'
		),
		output: $ => choice(
			seq($._target, $._ws, field('target', $.text)),
			'--no-output', '--interp',
			seq('--run', repeat1(seq(' ', $.text)))
		),

		/////////////////////
		dce_kind: $ => choice('std', 'full', 'no'),
		dce: $ => seq('--dce', $._ws, field("dce", $.dce_kind)),

		////////////////////
		_main_id: $ => choice('--main', '-m'),
		main: $ => seq($._main_id, $._ws, field('main', $.text)),

		////////////////////
		library: $ => seq(
			choice('-L', '--library'),
			field('library', seq(
				field("name", $.text),
				optional(seq(":",field("version", $.value)))
			))
		),

		////////////////////
		define: $ => seq(
			choice('-D', '--define'),
			field('define', seq(
				field("var",$.text),
				optional(seq("=",field("value", $.value)))
			))
		),

		////////////////////
		resource: $ => seq(
			choice('-r', '--resource'),
			field('resource',seq(
				field("file",$.text),
				optional(seq("@",field("name", $.text)))
			))
		),

		////////////////////
		remap: $ => seq(
			'--remap',
			field("package",$.text),
			":",
			field("target", $.text)
		),

		////////////////////
		server_listen: $ => seq(
			'--server-listen',
			optional(choice(
				'stdio',
				field("port", $.number),
				seq(
					field("host",$.text),
					':',
					field("port", $.number)
				)
			))
		),

		///////////////////////////
		server_connect: $ => seq(
			'--server-connect',
			optional(choice(
				field("port", $.number),
				seq(
					field("host",$.text),
					':',
					field("port", $.number)
				)
			))
		),

		///////////////////////////
		connect: $ => seq(
			'--connect',
			optional(choice(
				field("port", $.number),
				seq(
					field("host",$.text),
					':',
					field("port", $.number)
				)
			))
		),


		////////////////////
		// generic ones
		no_param: $ => choice(/--[a-z]*/,/-[A-Za-z]*/),
		one_param: $ => seq(
			field('option', $.no_param),
			field('value',$.text)
		),

		////////////////////
		text: $ => /[\\.A-Za-z\/_-]+/,
		value: $ => /[\\.A-Za-z0-9\/_-]+/,
		number: $ => /[0-9]+/,
		_ws: $ => repeat1(' ')
	}
});
